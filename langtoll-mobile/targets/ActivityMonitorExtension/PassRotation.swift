// Rotates the vocabulary word on the pass Live Activity from the background.
//
// A Live Activity cannot change its own content: Apple's supported update paths
// are the app (suspended while the user is off in their unlocked apps — exactly
// when rotation matters) or APNs pushes (dead offline, and "works at 7am on the
// subway" is the product's core promise). This extension is the third path: it
// already wakes at DeviceActivity interval boundaries for the re-lock, so
// blocking.ts arms extra staggered `langtoll-word.<k>.<stamp>` monitors and each
// intervalDidStart advances the deck by one card.
//
// Honesty note: updating an activity from a DeviceActivityMonitor extension is
// undocumented territory. It compiles and the extension shares the app group,
// but if iOS declines the update the island simply keeps its current word —
// every failure path here degrades to "no rotation", never to a broken island.
// ROTATION_DEBUG_KEY records what actually happened so the dev screen in the
// app can report it from a real device.
//
// PassActivityAttributes is the THIRD copy of this struct (widget + app module).
// ActivityKit matches on type name + Codable shape: all three must stay
// byte-for-byte identical or updates silently target nothing.
import ActivityKit
import Foundation

struct PassActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var expiresAt: Date
    var word: String?
    var translation: String?
  }

  var passenger: String
  var packLabel: String
  var serial: String
}

// Mirrored in modules/langtoll-activity/ios/LangTollActivityModule.swift.
let ROTATION_WORDS_KEY = "langtoll.rotation.words"
let ROTATION_INDEX_KEY = "langtoll.rotation.index"
let ROTATION_DEBUG_KEY = "langtoll.rotation.lastResult"

/// The DeviceActivity name prefix blocking.ts uses for rotation wake-ups.
let WORD_MONITOR_PREFIX = "langtoll-word."

@available(iOS 16.2, *)
func advancePassWord() {
  guard let defaults = userDefaults else { return }

  guard
    let raw = defaults.string(forKey: ROTATION_WORDS_KEY),
    let data = raw.data(using: .utf8),
    let pairs = try? JSONDecoder().decode([[String]].self, from: data),
    !pairs.isEmpty
  else {
    defaults.set("no deck stored", forKey: ROTATION_DEBUG_KEY)
    return
  }

  let index = defaults.integer(forKey: ROTATION_INDEX_KEY)
  let pair = pairs[index % pairs.count]
  defaults.set(index + 1, forKey: ROTATION_INDEX_KEY)

  let activities = Activity<PassActivityAttributes>.activities
  guard !activities.isEmpty else {
    defaults.set("wake ok, 0 activities visible", forKey: ROTATION_DEBUG_KEY)
    return
  }

  // The callback is synchronous and the extension process dies soon after it
  // returns; the semaphore holds the process alive long enough for the async
  // update to land. Bounded wait — a hung update must never stall the re-lock
  // machinery this extension actually exists for.
  let semaphore = DispatchSemaphore(value: 0)
  Task {
    var updated = 0
    for activity in activities {
      let previous = activity.content
      let state = PassActivityAttributes.ContentState(
        expiresAt: previous.state.expiresAt,
        word: pair.first,
        translation: pair.count > 1 ? pair[1] : nil)
      await activity.update(ActivityContent(state: state, staleDate: previous.staleDate))
      updated += 1
    }
    defaults.set(
      "rotated to #\(index % pairs.count) (\(pair.first ?? "?")), \(updated) activity(ies)",
      forKey: ROTATION_DEBUG_KEY)
    semaphore.signal()
  }
  _ = semaphore.wait(timeout: .now() + 3)
}
