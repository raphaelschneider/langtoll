# Localized store captures

How the de/es/fr/it/pt raws in `../raw/<locale>/` and `../raw-ipad/<locale>/` were
made (2026-09-19). `../store_shots.py --locale <x>` composes them; finals live in
`store/screenshots/<locale>/{iphone,ipad-13}/`.

## Rules the captures follow

- App UI in the listing's language, captions from `CAPTIONS` in `store_shots.py`.
- Courses follow the English set (01 de · 03 es · 04 pt · 05 fr · 06 it), except that
  a reader is never shown a course in their own language — that one becomes English.
- Shot 02: five lock-screen cards + two island pills, seven different words AND seven
  different translations per set (`LEAD` / `ISLAND_LEAD` in `cap.py`; salut/ciao
  translate both hi and bye, es/pt cognates translate to themselves — check again
  if you change a word).

## Recipe

1. `git apply capture/shots.patch` (from the repo root) — capture-only hooks:
   `session?shot=order|order_done|done` deep links (order_done: the sentence built
   correctly and checked, green banner, Tolly happy; raws as `practice_done.png`), Plus mock allowed, telemetry off.
   **Never commit it; `git checkout` those three files afterwards.**
2. Release sim build with the flags, telemetry pointed at a dead address:
   `EXPO_NO_DOTENV=1 EXPO_PUBLIC_SHOTS=1 EXPO_PUBLIC_API_URL=http://127.0.0.1:9 EXPO_PUBLIC_DEV_TOOLS=0 EXPO_PUBLIC_REVENUECAT_IOS_KEY= RCT_USE_PREBUILT_RNCORE=0 xcodebuild -workspace ios/LangToll.xcworkspace -scheme LangToll -configuration Release -sdk iphonesimulator -destination 'id=<udid>' build`
   then `xcrun simctl install <udid> <DerivedData>/…/LangToll.app` on each sim.
3. `swiftc -O capture/ocr.swift -o capture/work/ocr` (macOS Vision OCR — finds the
   hook's rotating language word, rejects lock frames with a permission prompt).
4. Use your OWN simulators by UDID (other sessions drive "booted" ones), with Maestro
   on `JAVA_HOME=/opt/homebrew/opt/openjdk`:
   `capture/batch.sh iphone <udid> de es fr it pt` and `capture/batch.sh ipad <udid> …`
   (`batch2.sh` redoes only wallet + lock cards + islands).
5. `python3 store_shots.py --raw raw --out ../../store/screenshots/<l>/iphone --locale <l>`
   (and `--raw raw-ipad --canvas ipad --out …/ipad-13`); drop the contact sheet and
   `06_plus_alternate.png` from the upload folders.

Seeding writes the `langtoll:v1` AsyncStorage blob straight into the app container
(`cap.py state()`); each capture kind is one launch.
