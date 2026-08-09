// Native speech path for LangToll.
//
// expo-speech sends an utterance straight to the speaker: you get language,
// voice, rate, pitch, volume and nothing else. That is not enough for a
// pronunciation teacher, because the raw AVSpeechSynthesizer output is bass-heavy
// and sibilant, and there is no way to insert processing between the synthesizer
// and the output.
//
// So instead of speaking, we RENDER. AVSpeechSynthesizer.write(_:toBufferCallback:)
// hands back PCM buffers, which we concatenate and play through an AVAudioEngine
// graph we control:
//
//     playerNode -> AVAudioUnitEQ (shaping + de-ess) -> mainMixer -> output
//
// Everything about that chain is exposed to JS so it can be tuned by ear from the
// dev voice lab rather than by rebuilding.
//
// NOTE on de-essing: the band below is a STATIC narrow cut at the sibilance
// frequency, not a dynamic de-esser. A true de-esser compresses only when
// sibilance exceeds a threshold; AVAudioUnitEQ cannot do that, and Apple's
// DynamicsProcessor audio unit would need a parallel band-split path. Static
// cutting is audible on 's' but also very slightly dulls everything else. It is
// the right first version; if it isn't enough we add the dynamics AU.
import ExpoModulesCore
import AVFoundation

/// Defaults tuned by ear ON DEVICE (not the simulator, whose audio path is not
/// representative) in the dev voice lab, 2026-07-18. Locked in here so a fresh
/// install sounds right before anyone touches a setting.
struct SpeechShaping {
  var highPassHz: Float = 110      // remove rumble / boom — safe, speech has no fundamental here
  var lowMidHz: Float = 250        // muddiness
  var lowMidGain: Float = -6
  var presenceHz: Float = 3200     // consonant definition
  var presenceGain: Float = 5
  var outputGain: Float = 0        // makeup, dB

  // ── dynamic de-esser ──────────────────────────────────────────────────────
  var deEssHz: Float = 6500        // split frequency; sibilance sits high on these voices
  var deEssThresholdDb: Float = -22 // level in the sibilance band above which we act
  var deEssRatio: Float = 2        // 4:1 compression on the excess
  var deEssMaxCutDb: Float = 18    // hard limit on reduction, so an 's' never vanishes
  var deEssAttackMs: Float = 1.5   // fast — sibilance is short
  var deEssReleaseMs: Float = 40   // slow enough not to pump between syllables
}

/// Second-order high-pass (RBJ cookbook). Used to isolate the sibilance band so
/// it can be compressed independently of the rest of the voice.
private struct Biquad {
  var b0: Float = 1, b1: Float = 0, b2: Float = 0, a1: Float = 0, a2: Float = 0
  var x1: Float = 0, x2: Float = 0, y1: Float = 0, y2: Float = 0

  init(highPassHz f0: Float, sampleRate: Float, q: Float = 0.707) {
    let w0 = 2 * Float.pi * min(max(f0, 20), sampleRate / 2 - 100) / sampleRate
    let cw = cos(w0), sw = sin(w0)
    let alpha = sw / (2 * q)
    let a0 = 1 + alpha
    b0 = (1 + cw) / 2 / a0
    b1 = -(1 + cw) / a0
    b2 = (1 + cw) / 2 / a0
    a1 = (-2 * cw) / a0
    a2 = (1 - alpha) / a0
  }

  mutating func process(_ x: Float) -> Float {
    let y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
    x2 = x1; x1 = x
    y2 = y1; y1 = y
    return y
  }
}

public final class LangTollSpeechModule: Module {
  private let synthesizer = AVSpeechSynthesizer()
  private let engine = AVAudioEngine()
  private let player = AVAudioPlayerNode()
  private var eq: AVAudioUnitEQ?
  private var shaping = SpeechShaping()
  private var engineReady = false
  // Diagnostics state — see getDiagnostics().
  private var lastRenderFrames: Int = 0
  private var lastPlayedThroughEQ = false
  private var lastError: String?
  private var lastDeEssPeakCutDb: Float = 0

  // Render-epoch: speak() renders the WHOLE utterance before playing, so a
  // stop() (or a newer speak) can land while a render is still in flight — and
  // without this guard that stale render finishes and plays anyway, which is
  // how rapid word-taps queued up and played one after another. Same pattern
  // as lib/tts.ts's speechEpoch, one layer down. The lock covers the write
  // callback, which fires on the synthesizer's own thread.
  private var speakEpoch: Int = 0
  private let epochLock = NSLock()

  private func bumpEpoch() -> Int {
    epochLock.lock(); defer { epochLock.unlock() }
    speakEpoch += 1
    return speakEpoch
  }

  private func currentEpoch() -> Int {
    epochLock.lock(); defer { epochLock.unlock() }
    return speakEpoch
  }

  public func definition() -> ModuleDefinition {
    Name("LangTollSpeech")

    // Session mode iOS reserves for speech content. expo-audio can set the
    // category but not the MODE, which is the half that matters here.
    AsyncFunction("configureSession") { () -> Void in
      let session = AVAudioSession.sharedInstance()
      do {
        try session.setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
        try session.setActive(true, options: [])
        self.lastError = nil
      } catch {
        self.lastError = "session: \(error.localizedDescription)"
        throw error
      }
    }

    // Diagnostics. The session calls and the render path both fail silently by
    // design (audio should never crash a lesson), so without a readout there is
    // no way to tell "configured correctly" from "threw and was swallowed".
    AsyncFunction("getDiagnostics") { () -> [String: Any] in
      let session = AVAudioSession.sharedInstance()
      return [
        "category": session.category.rawValue,
        "mode": session.mode.rawValue,
        "sampleRate": session.sampleRate,
        "outputVolume": session.outputVolume,
        "engineRunning": self.engine.isRunning,
        "engineReady": self.engineReady,
        "lastRenderFrames": self.lastRenderFrames,
        "lastPlayedThroughEQ": self.lastPlayedThroughEQ,
        "lastError": self.lastError ?? "",
        "lastDeEssPeakCutDb": self.lastDeEssPeakCutDb,
      ]
    }

    AsyncFunction("setShaping") { (opts: [String: Double]) -> Void in
      if let v = opts["highPassHz"] { self.shaping.highPassHz = Float(v) }
      if let v = opts["lowMidHz"] { self.shaping.lowMidHz = Float(v) }
      if let v = opts["lowMidGain"] { self.shaping.lowMidGain = Float(v) }
      if let v = opts["presenceHz"] { self.shaping.presenceHz = Float(v) }
      if let v = opts["presenceGain"] { self.shaping.presenceGain = Float(v) }
      if let v = opts["deEssHz"] { self.shaping.deEssHz = Float(v) }
      if let v = opts["deEssThresholdDb"] { self.shaping.deEssThresholdDb = Float(v) }
      if let v = opts["deEssRatio"] { self.shaping.deEssRatio = Float(v) }
      if let v = opts["deEssMaxCutDb"] { self.shaping.deEssMaxCutDb = Float(v) }
      if let v = opts["deEssAttackMs"] { self.shaping.deEssAttackMs = Float(v) }
      if let v = opts["deEssReleaseMs"] { self.shaping.deEssReleaseMs = Float(v) }
      if let v = opts["outputGain"] { self.shaping.outputGain = Float(v) }
      self.applyShaping()
    }

    AsyncFunction("stop") { () -> Void in
      _ = self.bumpEpoch()
      self.player.stop()
      self.synthesizer.stopSpeaking(at: .immediate)
    }

    // Render → shape → play. Resolves once playback has been scheduled, not when
    // it finishes; callers treat speech as fire-and-forget.
    AsyncFunction("speak") { (text: String, opts: [String: Any], promise: Promise) in
      // New speech preempts old right here, not just via the JS stop() call —
      // the two bridge calls are independent, so relying on their order left a
      // window where the old render survived. Cutting playback before the new
      // render also silences the previous word during the render gap.
      let epoch = self.bumpEpoch()
      self.player.stop()
      self.synthesizer.stopSpeaking(at: .immediate)

      let utterance = AVSpeechUtterance(string: text)

      if let voiceId = opts["voice"] as? String,
         let voice = AVSpeechSynthesisVoice(identifier: voiceId) {
        utterance.voice = voice
      } else if let lang = opts["language"] as? String {
        utterance.voice = AVSpeechSynthesisVoice(language: lang)
      }
      if let rate = opts["rate"] as? Double {
        utterance.rate = Float(rate) * AVSpeechUtteranceDefaultSpeechRate
      }
      if let pitch = opts["pitch"] as? Double { utterance.pitchMultiplier = Float(pitch) }
      if let volume = opts["volume"] as? Double { utterance.volume = Float(volume) }

      var collected: AVAudioPCMBuffer?
      var failed: String?

      self.synthesizer.write(utterance) { buffer in
        guard let pcm = buffer as? AVAudioPCMBuffer else { return }
        // The synthesizer signals completion with a zero-length buffer.
        if pcm.frameLength == 0 {
          // Superseded or stopped while rendering: this audio must not play.
          guard epoch == self.currentEpoch() else {
            promise.resolve(false)
            return
          }
          if let out = collected {
            self.lastRenderFrames = Int(out.frameLength)
            do {
              // Dynamic de-ess first, then the static EQ node handles the rest.
              try self.play(self.deEss(out))
              self.lastPlayedThroughEQ = true
              self.lastError = nil
            } catch {
              failed = error.localizedDescription
              self.lastPlayedThroughEQ = false
              self.lastError = failed
            }
          } else {
            self.lastRenderFrames = 0
            self.lastPlayedThroughEQ = false
            self.lastError = "synthesizer returned no audio"
          }
          promise.resolve(failed == nil)
          return
        }
        if collected == nil {
          collected = pcm
        } else {
          collected = LangTollSpeechModule.append(collected!, pcm)
        }
      }
    }
  }

  // MARK: - audio graph

  private func ensureEngine(format: AVAudioFormat) throws {
    if engineReady { return }
    let unit = AVAudioUnitEQ(numberOfBands: 3)
    unit.globalGain = shaping.outputGain
    engine.attach(player)
    engine.attach(unit)
    engine.connect(player, to: unit, format: format)
    engine.connect(unit, to: engine.mainMixerNode, format: format)
    eq = unit
    applyShaping()
    try engine.start()
    engineReady = true
  }

  private func applyShaping() {
    guard let eq = eq, eq.bands.count >= 3 else { return }

    let hp = eq.bands[0]
    hp.filterType = .highPass
    hp.frequency = shaping.highPassHz
    hp.bypass = false

    let mud = eq.bands[1]
    mud.filterType = .parametric
    mud.frequency = shaping.lowMidHz
    mud.bandwidth = 1.2
    mud.gain = shaping.lowMidGain
    mud.bypass = false

    let presence = eq.bands[2]
    presence.filterType = .parametric
    presence.frequency = shaping.presenceHz
    presence.bandwidth = 1.0
    presence.gain = shaping.presenceGain
    presence.bypass = false

    // De-essing is no longer an EQ band — see deEss(), which compresses the
    // sibilance band dynamically on the rendered buffer.

    eq.globalGain = shaping.outputGain
  }

  /// True dynamic de-essing, done offline on the fully rendered utterance.
  ///
  /// Splits the signal into a sibilance band (high-passed at deEssHz) and the
  /// remainder, tracks the sibilance envelope, and compresses ONLY that band when
  /// it exceeds the threshold — then recombines. Unlike the static EQ cut this
  /// replaces, a word with no harsh 's' passes through completely untouched.
  ///
  /// Doing it offline rather than in the AVAudioEngine graph is possible because
  /// we render the whole utterance before playing it, and it buys exact control
  /// over attack/release without real-time constraints.
  private func deEss(_ buffer: AVAudioPCMBuffer) -> AVAudioPCMBuffer {
    guard shaping.deEssMaxCutDb > 0, let data = buffer.floatChannelData else { return buffer }
    let sr = Float(buffer.format.sampleRate)
    let n = Int(buffer.frameLength)
    let channels = Int(buffer.format.channelCount)

    // Envelope coefficients: standard one-pole attack/release.
    let atk = exp(-1.0 / (max(shaping.deEssAttackMs, 0.1) * 0.001 * sr))
    let rel = exp(-1.0 / (max(shaping.deEssReleaseMs, 1.0) * 0.001 * sr))
    let thresh = shaping.deEssThresholdDb
    let ratio = max(shaping.deEssRatio, 1)
    let maxCut = shaping.deEssMaxCutDb

    var peakCut: Float = 0

    for ch in 0..<channels {
      var hp = Biquad(highPassHz: shaping.deEssHz, sampleRate: sr)
      var env: Float = 0
      var gainSmoothed: Float = 1
      let p = data[ch]

      for i in 0..<n {
        let x = p[i]
        let high = hp.process(x)      // sibilance band
        let low = x - high            // everything else, complementary

        // Envelope of the sibilance band only.
        let rect = abs(high)
        env = rect > env ? atk * env + (1 - atk) * rect : rel * env + (1 - rel) * rect

        // Gain computer, in dB, applied to the high band alone.
        let envDb = 20 * log10(max(env, 1e-7))
        var cutDb: Float = 0
        if envDb > thresh {
          cutDb = min((envDb - thresh) * (1 - 1 / ratio), maxCut)
        }
        peakCut = max(peakCut, cutDb)

        let target = pow(10, -cutDb / 20)
        // Smooth the gain itself so we never step-change mid-waveform.
        gainSmoothed = target < gainSmoothed
          ? atk * gainSmoothed + (1 - atk) * target
          : rel * gainSmoothed + (1 - rel) * target

        p[i] = low + high * gainSmoothed
      }
    }

    lastDeEssPeakCutDb = peakCut
    return buffer
  }

  private func play(_ buffer: AVAudioPCMBuffer) throws {
    try ensureEngine(format: buffer.format)
    if !engine.isRunning { try engine.start() }
    player.stop()
    player.scheduleBuffer(buffer, at: nil, options: [.interrupts], completionHandler: nil)
    player.play()
  }

  /// Concatenate two PCM buffers of the same format into a new buffer.
  private static func append(_ a: AVAudioPCMBuffer, _ b: AVAudioPCMBuffer) -> AVAudioPCMBuffer {
    let frames = a.frameLength + b.frameLength
    guard
      a.format.isEqual(b.format),
      let out = AVAudioPCMBuffer(pcmFormat: a.format, frameCapacity: frames),
      let src1 = a.floatChannelData, let src2 = b.floatChannelData, let dst = out.floatChannelData
    else { return a }

    let channels = Int(a.format.channelCount)
    for ch in 0..<channels {
      memcpy(dst[ch], src1[ch], Int(a.frameLength) * MemoryLayout<Float>.size)
      memcpy(dst[ch] + Int(a.frameLength), src2[ch], Int(b.frameLength) * MemoryLayout<Float>.size)
    }
    out.frameLength = frames
    return out
  }
}
