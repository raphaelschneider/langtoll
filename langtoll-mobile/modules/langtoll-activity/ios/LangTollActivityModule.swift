// App-side ActivityKit bridge. The pod targets iOS 15.1 with the app, so every
// ActivityKit touch sits behind #available(iOS 16.2) — below that the functions
// report unsupported and the JS side simply never shows a Live Activity.
//
// PassActivityAttributes is DUPLICATED from targets/PassActivity — ActivityKit
// matches app and widget by type name + Codable shape; keep both identical.
import ActivityKit
import ExpoModulesCore

struct PassActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var expiresAt: Date
    // Rotating vocabulary shown on the island; advanced in the background by
    // the DeviceActivity extension (targets/ActivityMonitorExtension/PassRotation.swift).
    var word: String?
    var translation: String?
  }

  var passenger: String
  var packLabel: String
  var serial: String
}

// App-group storage the extension reads the rotation from. Key names are
// mirrored in PassRotation.swift — keep in lockstep.
let ROTATION_WORDS_KEY = "langtoll.rotation.words"
let ROTATION_INDEX_KEY = "langtoll.rotation.index"
let ROTATION_DEBUG_KEY = "langtoll.rotation.lastResult"

private func appGroupDefaults() -> UserDefaults? {
  guard
    let group = Bundle.main.object(forInfoDictionaryKey: "REACT_NATIVE_DEVICE_ACTIVITY_APP_GROUP")
      as? String
  else { return nil }
  return UserDefaults(suiteName: group)
}

public class LangTollActivityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("LangTollActivity")

    Function("areActivitiesEnabled") { () -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      return ActivityAuthorizationInfo().areActivitiesEnabled
    }

    // Replaces any live pass activity — there is only ever one pass at a time.
    Function("startPassActivity") {
      (
        expiresAtMs: Double, passenger: String, packLabel: String, serial: String,
        word: String?, translation: String?
      ) -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      guard ActivityAuthorizationInfo().areActivitiesEnabled else { return false }

      let expiresAt = Date(timeIntervalSince1970: expiresAtMs / 1000)
      guard expiresAt > Date() else { return false }

      let attributes = PassActivityAttributes(
        passenger: passenger, packLabel: packLabel, serial: serial)
      let content = ActivityContent(
        state: PassActivityAttributes.ContentState(
          expiresAt: expiresAt, word: word, translation: translation),
        // Past the expiry the activity is stale by definition — iOS dims it if the
        // app never got a chance to end it properly.
        staleDate: expiresAt)

      do {
        // End leftovers first so a re-earned pass replaces the old countdown.
        for activity in Activity<PassActivityAttributes>.activities {
          Task { await activity.end(nil, dismissalPolicy: .immediate) }
        }
        _ = try Activity.request(attributes: attributes, content: content, pushType: nil)
        return true
      } catch {
        return false
      }
    }

    Function("endPassActivity") {
      guard #available(iOS 16.2, *) else { return }
      for activity in Activity<PassActivityAttributes>.activities {
        Task { await activity.end(nil, dismissalPolicy: .immediate) }
      }
    }

    // Store the rotation deck in the app group where the DeviceActivity
    // extension can reach it. `pairsJson` is [[word, translation], ...].
    // Index starts at 1 because the activity itself launches showing pair 0.
    Function("setWordRotation") { (pairsJson: String) in
      guard let defaults = appGroupDefaults() else { return }
      defaults.set(pairsJson, forKey: ROTATION_WORDS_KEY)
      defaults.set(1, forKey: ROTATION_INDEX_KEY)
    }

    // What the extension last did — surfaced in the dev tools so a silent
    // failure on a real device is diagnosable from the phone alone.
    Function("getRotationDebug") { () -> String? in
      appGroupDefaults()?.string(forKey: ROTATION_DEBUG_KEY)
    }
  }
}
