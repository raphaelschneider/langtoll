#!/usr/bin/env python3
"""Localized store-shot capture driver. Seeds AsyncStorage, launches, screenshots.

usage: cap.py <udid> <kind> <ui_locale> <course> <out.png>
kinds: home_locked | home_active | wallet | order | order_done | done | hook | lock | island
"""
import json, os, random, re, subprocess, sys, time, datetime

APP = 'com.langtoll.app'
MOBILE = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
HERE = os.path.dirname(os.path.abspath(__file__))
TMP = os.path.join(HERE, 'work')  # flows, full-frame captures, the compiled ocr binary
os.makedirs(TMP, exist_ok=True)
FOLDER = {'de': 'german', 'es': 'spanish', 'fr': 'french', 'it': 'italian', 'pt': 'portuguese', 'en': 'english'}
MAESTRO = os.path.expanduser('~/.maestro/bin/maestro')
ENV = {**os.environ, 'JAVA_HOME': '/opt/homebrew/opt/openjdk'}


def sh(*a, check=True):
    return subprocess.run(a, check=check, capture_output=True, text=True).stdout


def vocab_ids(course, n=13):
    src = open(f'{MOBILE}/content/{FOLDER[course]}/a1-vocab.ts').read()
    return re.findall(r"id: '([^']+)'", src)[:n]


# The lock-screen/island card shows the most recently seen struggling word
# (lib/word-rotation.ts). One distinct greeting per course keeps the 02 cascade
# varied and avoids cognates that translate to themselves (es/pt "por favor").
LEAD = {'de': 'tschüss', 'fr': 'bonsoir', 'es': 'buenos días', 'pt': 'boa noite',
        'it': 'grazie', 'en': 'see you later'}


# The island pill sits in the same 02 cascade as the cards: its own words, so no
# word or translation repeats within a set (islands only ever carry de/fr/it/pt).
ISLAND_LEAD = {'de': 'ja', 'fr': 's’il vous plaît', 'it': 'prego', 'pt': 'desculpa',
               'es': 'perdón', 'en': 'sorry'}


def lead_id(course, table=None):
    src = open(f'{MOBILE}/content/{FOLDER[course]}/a1-vocab.ts').read()
    for vid, word in re.findall(r"id: '([^']+)', de: '([^']+)'", src):
        if word == (table or LEAD)[course]:
            return vid
    raise SystemExit(f'no lead word for {course}')


def state(ui, course, *, onboarded=True, active=False, mastered=5, lead=None):
    now = datetime.datetime.now(datetime.timezone.utc)
    iso = lambda d: d.isoformat().replace('+00:00', 'Z')
    ids = vocab_ids(course)
    progress = {}
    for i, k in enumerate(ids):
        m = i < mastered
        progress[k] = {'item_id': k, 'seen': 4 if m else 1, 'correct': 4 if m else 1,
                       'streak': 3 if m else 1, 'last_seen_at': iso(now - datetime.timedelta(hours=i + 1))}
    if lead:
        # A one-word deck: every other A1 item mastered, only the lead word
        # struggling — the island advances the deck each time the app comes
        # forward, and a deck of one lands on the lead however often it turns.
        src = open(f'{MOBILE}/content/{FOLDER[course]}/a1-vocab.ts').read()
        for k in re.findall(r"id: '([^']+)'", src):
            progress[k] = {'item_id': k, 'seen': 4, 'correct': 4, 'streak': 3,
                           'last_seen_at': iso(now - datetime.timedelta(days=1))}
        k = lead_id(course, lead)
        progress[k] = {'item_id': k, 'seen': 2, 'correct': 1, 'streak': 0, 'last_seen_at': iso(now)}
    ms = int(time.time() * 1000)
    return {
        'onboarded': onboarded, 'name': 'Ralph', 'learningLanguage': course, 'level': 'A1',
        'locale': ui, 'appearance': 'dark', 'soundEnabled': False,
        'plan': 'plus', 'planSince': iso(now - datetime.timedelta(days=20)),
        'plusExpiresAt': iso(now + datetime.timedelta(days=300)), 'plusWillRenew': True, 'plusIsTrial': False,
        'progress': progress, 'sessionsCompleted': 9, 'totalAnswered': 40, 'totalCorrect': 36,
        'streak': 3, 'lastPassDate': (now - datetime.timedelta(days=1)).date().isoformat(),
        'unlockExpiresAt': ms + 30 * 60_000 - 4000 if active else ms - 3 * 3600_000,
        'reviewPromptedAt': iso(now), 'firstLaunchAt': iso(now - datetime.timedelta(days=30)),
        'nudgeHour': 18, 'blockedApps': ['TikTok', 'Instagram'],
    }


def seed(udid, st):
    sh('xcrun', 'simctl', 'terminate', udid, APP, check=False)
    c = sh('xcrun', 'simctl', 'get_app_container', udid, APP, 'data').strip()
    d = f'{c}/Library/Application Support/{APP}/RCTAsyncLocalStorage_V1'
    os.makedirs(d, exist_ok=True)
    for f in os.listdir(d):
        os.remove(os.path.join(d, f))
    # keep device identity out of it: only our key
    json.dump({'langtoll:v1': json.dumps(st)}, open(f'{d}/manifest.json', 'w'))


def maestro(udid, steps):
    flow = f'{TMP}/flow_{udid}.yaml'
    open(flow, 'w').write(f'appId: {APP}\n---\n' + steps)
    subprocess.run([MAESTRO, '--device', udid, 'test', flow], env=ENV, capture_output=True, text=True, timeout=240)


def shot(udid, out):
    sh('xcrun', 'simctl', 'io', udid, 'screenshot', out)


def statusbar(udid):
    sh('xcrun', 'simctl', 'status_bar', udid, 'override', '--time', '9:41', '--batteryState', 'charged',
       '--batteryLevel', '100', '--wifiBars', '3', '--cellularBars', '4', check=False)


def openurl(udid, url):
    sh('xcrun', 'simctl', 'openurl', udid, url, check=False)
    time.sleep(1.5)
    maestro(udid, '- tapOn:\n    text: "Open"\n    optional: true\n')


def main():
    udid, kind, ui, course, out = sys.argv[1:6]
    statusbar(udid)
    active = kind in ('home_active', 'lock', 'island')
    # wallet: 4 mastered so the dimmed in-progress ticket falls where Tolly
    # stands in 05_wallet (the localized wallet has an extra hint line)
    seed(udid, state(ui, course, onboarded=kind != 'hook', active=active, mastered=4 if kind == 'wallet' else 5,
                     lead={'lock': LEAD, 'island': ISLAND_LEAD}.get(kind)))
    maestro(udid, '- pressKey: Home\n')
    sh('xcrun', 'simctl', 'launch', udid, APP)
    time.sleep(4)
    if kind == 'wallet':
        openurl(udid, 'langtoll://wallet'); time.sleep(2.5)
    elif kind in ('order', 'done', 'order_done'):
        openurl(udid, f'langtoll://session?shot={kind}'); time.sleep(4 if kind in ('done', 'order_done') else 3)
    elif kind == 'hook':
        want = sys.argv[6].lower()[:5]  # localized language name that must be on screen
        for _ in range(60):
            shot(udid, out)
            txt = subprocess.run([f'{TMP}/ocr', out], capture_output=True, text=True).stdout
            if want in txt.lower():
                # 0.35s on: past any fade-in; a fade-out match lands on the
                # next word instead and fails the check below.
                time.sleep(0.35)
                shot(udid, out)  # the confirming frame is the one kept
                if want in subprocess.run([f'{TMP}/ocr', out], capture_output=True, text=True).stdout.lower():
                    print('ok', out); return
            # jittered: a fixed period can phase-lock with the 1.5s rotation
            # and keep catching the target word only at the end of its window
            time.sleep(random.uniform(0.1, 0.9))
        sys.exit(f'hook: never saw {want}')
    elif kind == 'lock':
        maestro(udid, '- pressKey: Lock\n- pressKey: Lock\n- waitForAnimationToEnd\n'
                      '- tapOn:\n    text: "(Always )?Allow"\n    optional: true\n')
        time.sleep(2.5)
    elif kind == 'island':
        maestro(udid, '- tapOn:\n    text: "(Always )?Allow"\n    optional: true\n- pressKey: Home\n')
        time.sleep(2.5)
    shot(udid, out)
    if kind == 'lock':
        txt = subprocess.run([f'{TMP}/ocr', out], capture_output=True, text=True).stdout.lower()
        if 'allow' in txt:
            sys.exit('lock: permission prompt still on screen')
        if 'carrier' not in txt:  # the lock screen's status bar; the app has none
            sys.exit('lock: not on the lock screen')
    print('ok', out)


if __name__ == '__main__':
    main()
