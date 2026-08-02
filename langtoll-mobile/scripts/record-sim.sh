#!/usr/bin/env bash
# Record the booted iOS Simulator to a clean .mp4 for the landing page / demos / Reels.
#   - sets the Apple-marketing status bar (9:41, full battery, full bars) before recording
#   - records the booted simulator screen (no bezel — add a device frame in post if you want one)
#   - on Ctrl+C: finalizes the video and clears the status bar override
#
# Usage:
#   scripts/record-sim.sh                 # → recordings/langtoll-YYYYmmdd-HHMMSS.mp4
#   scripts/record-sim.sh my-demo.mp4     # → my-demo.mp4
#   RECORD_DIR=clips scripts/record-sim.sh
#
# Ported from relift/scripts/record-sim.sh.
set -uo pipefail

if ! xcrun simctl list devices booted 2>/dev/null | grep -q "(Booted)"; then
  echo "No booted simulator. Boot one first (open -a Simulator, or: npm run ios)." >&2
  exit 1
fi

DIR="${RECORD_DIR:-recordings}"
mkdir -p "$DIR"
OUT="${1:-$DIR/langtoll-$(date +%Y%m%d-%H%M%S).mp4}"

# Pretty, deterministic status bar for the shot.
xcrun simctl status_bar booted override \
  --time "9:41" --batteryState charged --batteryLevel 100 \
  --dataNetwork wifi --wifiBars 3 --cellularBars 4 >/dev/null 2>&1 || true

REC_PID=""
cleanup_done=0
finish() {
  [ "$cleanup_done" = 1 ] && return
  cleanup_done=1
  [ -n "$REC_PID" ] && kill -INT "$REC_PID" 2>/dev/null
  [ -n "$REC_PID" ] && wait "$REC_PID" 2>/dev/null
  xcrun simctl status_bar booted clear >/dev/null 2>&1 || true
  echo ""
  echo "✓ saved $OUT"
}
trap finish INT TERM EXIT

echo "● Recording booted simulator → $OUT"
echo "  press Ctrl+C to stop."
xcrun simctl io booted recordVideo --codec=h264 "$OUT" &
REC_PID=$!
wait "$REC_PID"
