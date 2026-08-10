// The pass, live: unlock countdown as a Live Activity — lock-screen banner and
// Dynamic Island. Styled as the in-app PassCard's active state (rail navy, teal
// brand, validation-mint timer). Tolly peeks from the island's expanded view.
//
// PassActivityAttributes is DUPLICATED in modules/langtoll-activity (the app-side
// bridge): ActivityKit matches app and widget by type name + Codable shape, so
// the two definitions must stay byte-for-byte identical.
import ActivityKit
import SwiftUI
import UIKit
import WidgetKit

/// Width a compact-island slot should take: the text's own measured width,
/// capped. A bare `.frame(maxWidth:)` is GREEDY — it claims the cap even for
/// "bonjour", which is how every pill briefly rendered at max width and
/// evicted the system clock unconditionally. Measuring gives min(ideal, cap):
/// short words hug, long words pin at the cap and scale down inside it.
/// 64pt/side chosen from real captures: ~75pt sides already cost the clock.
let COMPACT_SLOT_CAP: CGFloat = 64

func compactSlotWidth(_ text: String, size: CGFloat, weight: UIFont.Weight) -> CGFloat {
  let font = UIFont.systemFont(ofSize: size, weight: weight)
  let ideal = (text as NSString).size(withAttributes: [.font: font]).width
  return min(ceil(ideal) + 1, COMPACT_SLOT_CAP)
}

struct PassActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var expiresAt: Date
    // The rotating vocabulary card: while the pass runs, the island keeps
    // showing one word + its translation, advanced by the DeviceActivity
    // extension (see targets/ActivityMonitorExtension/PassRotation.swift).
    // Optional so a pass with no rotation data falls back to the countdown.
    var word: String?
    var translation: String?
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

/// The rotating vocabulary line: target word in cream, translation in teal.
/// One line, shrink-to-fit — German compounds and French phrases must never
/// wrap the island.
struct WordLine: View {
  let word: String
  let translation: String?
  var size: CGFloat

  var body: some View {
    HStack(alignment: .lastTextBaseline, spacing: 6) {
      Text(word)
        .font(.system(size: size, weight: .bold))
        .foregroundColor(.ticketCream)
      if let translation {
        Text(translation)
          .font(.system(size: size * 0.72))
          .foregroundColor(.railTeal)
      }
    }
    .lineLimit(1)
    .minimumScaleFactor(0.55)
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
      // With a word to teach, the word IS the headline and the countdown steps
      // back to a caption. The stale pass drops the word — an expired island
      // sells the next session, not vocabulary.
      if let word = context.state.word, !context.isStale {
        HStack(alignment: .center) {
          WordLine(word: word, translation: context.state.translation, size: 26)
          Spacer()
          TollyFace(stale: false, height: 34)
        }
        HStack {
          CountdownText(expiresAt: context.state.expiresAt, size: 13, weight: .semibold)
          Text("of phone time left")
            .font(.system(size: 11))
            .foregroundColor(.ticketCream.opacity(0.5))
          Spacer()
        }
      } else {
        HStack(alignment: .lastTextBaseline) {
          CountdownText(expiresAt: context.state.expiresAt, size: 36, stale: context.isStale)
          Text(context.isStale ? "pass expired — practise to unlock" : "of phone time left")
            .font(.system(size: 12))
            .foregroundColor(.ticketCream.opacity(0.6))
          Spacer()
          TollyFace(stale: context.isStale, height: 34)
        }
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
          if let word = context.state.word, !context.isStale {
            VStack(alignment: .leading, spacing: 4) {
              WordLine(word: word, translation: context.state.translation, size: 28)
              HStack(spacing: 6) {
                CountdownText(expiresAt: context.state.expiresAt, size: 12, weight: .semibold)
                Text("left")
                  .font(.system(size: 11))
                  .foregroundColor(.ticketCream.opacity(0.5))
                Spacer()
                Text(context.attributes.packLabel)
                  .font(.system(size: 10, weight: .semibold, design: .monospaced))
                  .kerning(1.2)
                  .foregroundColor(.ticketCream.opacity(0.7))
              }
            }
            .padding(.horizontal, 4)
          } else {
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
        }
      } compactLeading: {
        // The whole feature lives or dies in the compact views: they are what
        // floats above the unlocked apps. Mid-rotation the word takes the
        // leading slot and its translation the trailing one — both sides of
        // the cutout, because one side alone cannot fit "die Entschuldigung".
        // Tolly cedes compact to the vocabulary and keeps minimal + expanded.
        //
        // The slots ARE capped (founder call, 2026-08-10): iOS grows the pill
        // to fit its content and evicts status-bar items as it does — a long
        // pair like "buenos días · good morning" cost the user the CLOCK and
        // battery all day. compactSlotWidth = min(measured, cap), so short
        // words hug while long ones pin at the cap and shrink inside it;
        // word-rotation.ts additionally filters pairs past MAX_ISLAND_CHARS.
        if let word = context.state.word, !context.isStale {
          Text(word)
            .font(.system(size: 13, weight: .semibold))
            .foregroundColor(.ticketCream)
            .lineLimit(1)
            .minimumScaleFactor(0.6)
            .frame(width: compactSlotWidth(word, size: 13, weight: .semibold))
        } else {
          TollyFace(stale: context.isStale, height: 21)
        }
      } compactTrailing: {
        if context.state.word != nil, !context.isStale {
          if let translation = context.state.translation {
            Text(translation)
              .font(.system(size: 13))
              .foregroundColor(.railTeal)
              .lineLimit(1)
              .minimumScaleFactor(0.6)
              .frame(width: compactSlotWidth(translation, size: 13, weight: .regular))
          }
        } else {
          CountdownText(
            expiresAt: context.state.expiresAt, size: 13, weight: .semibold,
            stale: context.isStale
          )
          .frame(maxWidth: 44)
        }
      } minimal: {
        TollyFace(stale: context.isStale, height: 19)
      }
      .keylineTint(.railTeal)
    }
  }
}
