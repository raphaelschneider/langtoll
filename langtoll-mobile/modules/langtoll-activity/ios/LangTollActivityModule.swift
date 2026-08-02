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
  }

  var passenger: String
  var packLabel: String
  var serial: String
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
      (expiresAtMs: Double, passenger: String, packLabel: String, serial: String) -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      guard ActivityAuthorizationInfo().areActivitiesEnabled else { return false }

      let expiresAt = Date(timeIntervalSince1970: expiresAtMs / 1000)
      guard expiresAt > Date() else { return false }

      let attributes = PassActivityAttributes(
        passenger: passenger, packLabel: packLabel, serial: serial)
      let content = ActivityContent(
        state: PassActivityAttributes.ContentState(expiresAt: expiresAt),
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
  }
}
