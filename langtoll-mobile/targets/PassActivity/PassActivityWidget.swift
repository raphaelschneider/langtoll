// The pass, live: unlock countdown as a Live Activity — lock-screen banner and
// Dynamic Island. Styled as the in-app PassCard's active state (rail navy, teal
// brand, validation-mint timer). Tolly peeks from the island's expanded view.
//
// PassActivityAttributes is DUPLICATED in modules/langtoll-activity (the app-side
// bridge): ActivityKit matches app and widget by type name + Codable shape, so
// the two definitions must stay byte-for-byte identical.
import ActivityKit
import SwiftUI
import WidgetKit

struct PassActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var expiresAt: Date
  }

  var passenger: String
  var packLabel: String
  var serial: String
}

extension Color {
  static let railNavy = Color(red: 15 / 255, green: 22 / 255, blue: 27 / 255)
  static let railTeal = Color(red: 92 / 255, green: 189 / 255, blue: 205 / 255)
  static let ticketCream = Color(red: 236 / 255, green: 231 / 255, blue: 216 / 255)
  static let validationMint = Color(red: 79 / 255, green: 192 / 255, blue: 124 / 255)
  static let stampVermilion = Color(red: 240 / 255, green: 104 / 255, blue: 78 / 255)
}

/// Tolly at the booth: watching the clock while the pass is valid, glum once it
/// goes stale. `isStale` flips exactly at staleDate (= the expiry), so the island
/// changes face the moment the fare runs out — no update round-trip needed.
struct TollyFace: View {
  let stale: Bool
  var height: CGFloat

  var body: some View {
    Image(stale ? "tolly-peek-sad" : "tolly-peek")
      .resizable()
      .scaledToFit()
      .frame(height: height)
  }
}

/// The brand mark, drawn in vectors — crisp at any island size, no asset needed.
struct Roundel: View {
  var size: CGFloat
  var color: Color = .railTeal

  var body: some View {
    ZStack {
      Circle().strokeBorder(color, lineWidth: size * 0.14)
      Capsule().fill(color).frame(width: size * 0.86, height: size * 0.16)
    }
    .frame(width: size, height: size)
  }
}

struct CountdownText: View {
  let expiresAt: Date
  var size: CGFloat
  var weight: Font.Weight = .bold
  var stale: Bool = false

  var body: some View {
    Text(timerInterval: Date.now...max(Date.now, expiresAt), countsDown: true)
      .font(.system(size: size, weight: weight, design: .monospaced))
      .foregroundColor(stale ? .stampVermilion : .validationMint)
      .multilineTextAlignment(.trailing)
  }
}

struct LockScreenView: View {
  let context: ActivityViewContext<PassActivityAttributes>

  var body: some View {
    VStack(alignment: .leading, spacing: 6) {
      HStack {
        HStack(spacing: 6) {
          Roundel(size: 16)
          Text("LANGTOLL")
            .font(.system(size: 11, weight: .semibold))
            .kerning(2)
            .foregroundColor(.ticketCream.opacity(0.65))
        }
        Spacer()
        Text(context.isStale ? "EXPIRED" : "ACTIVE")
          .font(.system(size: 10, weight: .bold, design: .monospaced))
          .kerning(1.5)
          .foregroundColor(context.isStale ? .stampVermilion : .validationMint)
          .padding(.horizontal, 8)
          .padding(.vertical, 3)
          .overlay(
            Capsule().strokeBorder(
              (context.isStale ? Color.stampVermilion : Color.validationMint).opacity(0.5),
              lineWidth: 1))
      }
      HStack(alignment: .lastTextBaseline) {
        CountdownText(expiresAt: context.state.expiresAt, size: 36, stale: context.isStale)
        Text(context.isStale ? "pass expired — practise to unlock" : "of phone time left")
          .font(.system(size: 12))
          .foregroundColor(.ticketCream.opacity(0.6))
        Spacer()
        TollyFace(stale: context.isStale, height: 34)
      }
      HStack {
        Text(context.attributes.passenger)
          .font(.system(size: 11, weight: .semibold, design: .monospaced))
          .kerning(1.5)
          .foregroundColor(.ticketCream.opacity(0.8))
        Spacer()
        Text("\(context.attributes.packLabel) · \(context.attributes.serial)")
          .font(.system(size: 11, design: .monospaced))
          .foregroundColor(.ticketCream.opacity(0.5))
      }
    }
    .padding(16)
    .activityBackgroundTint(.railNavy)
    .activitySystemActionForegroundColor(.railTeal)
  }
}

@main
struct PassActivityBundle: WidgetBundle {
  var body: some Widget {
    PassActivityWidget()
  }
}

struct PassActivityWidget: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: PassActivityAttributes.self) { context in
      LockScreenView(context: context)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          HStack(spacing: 6) {
            Roundel(size: 18)
            Text("LANGTOLL")
              .font(.system(size: 10, weight: .semibold))
              .kerning(1.5)
              .foregroundColor(.ticketCream.opacity(0.65))
          }
          .padding(.leading, 4)
        }
        DynamicIslandExpandedRegion(.trailing) {
          // Tolly watches the clock from the booth — and sulks once the fare runs out.
          TollyFace(stale: context.isStale, height: 30)
            .padding(.trailing, 4)
        }
        DynamicIslandExpandedRegion(.bottom) {
          HStack(alignment: .lastTextBaseline, spacing: 8) {
            CountdownText(expiresAt: context.state.expiresAt, size: 34, stale: context.isStale)
            Text(context.isStale ? "pass expired" : "of phone time left")
              .font(.system(size: 12))
              .foregroundColor(.ticketCream.opacity(0.6))
            Spacer()
            Text(context.attributes.passenger)
              .font(.system(size: 10, weight: .semibold, design: .monospaced))
              .kerning(1.2)
              .foregroundColor(.ticketCream.opacity(0.7))
          }
          .padding(.horizontal, 4)
        }
      } compactLeading: {
        // The mascot IS the app's face here (Ralph's call) — roundel stays on the keyline.
        TollyFace(stale: context.isStale, height: 21)
      } compactTrailing: {
        CountdownText(
          expiresAt: context.state.expiresAt, size: 13, weight: .semibold,
          stale: context.isStale
        )
        .frame(maxWidth: 44)
      } minimal: {
        TollyFace(stale: context.isStale, height: 19)
      }
      .keylineTint(.railTeal)
    }
  }
}
