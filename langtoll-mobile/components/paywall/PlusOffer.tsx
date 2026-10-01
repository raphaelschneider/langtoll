// The Plus offer — feature list + selectable package cards + purchase CTA.
// Shared by the onboarding paywall step and the standalone /paywall route so
// pricing and purchase logic live in exactly one place. Purchases route through
// lib/purchases (real RevenueCat on the dev build, mock in Expo Go/simulator).
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Linking, Modal } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme, space, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { font } from '@/design/tokens';
import { Confetti, Twinkle } from './Festive';
import { useLayout, opticalCenter } from '@/design/layout';
import { PLUS_FEATURES, LEGAL_URLS, type Period } from '@/lib/plans';
import {
  getPackages,
  purchase,
  restore,
  perMonthEquivalent,
  perWeekEquivalent,
  yearOfMonthly,
  savingsVsMonthly,
  lastPurchaseError,
  type PlusPackage,
} from '@/lib/purchases';
import { track } from '@/lib/telemetry';
import { useT, resolvedLocale, type StringKey } from '@/lib/i18n';
import type { PaywallSource } from '@/lib/paywall';
import { isPlus, useAppState, getState } from '@/lib/store';
import type { Language } from '@/content/german/types';

// Title only (2026-09-29, "so crowded"): the detail lines ran to six lines of grey
// under three headlines and pushed the plans below the fold. The comparisons they
// carried ("free locks one app") live in Settings and the store description.
function HowRow({ icon, title }: { icon: any; title: string }) {
  const theme = useTheme();
  return (
    <View style={styles.featureRow}>
      <View
        style={[styles.featureIcon, { backgroundColor: withAlpha(theme.accent, 0.10), borderColor: withAlpha(theme.accent, 0.3) }]}
      >
        <Ionicons name={icon} size={19} color={theme.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodyMedium">{title}</Text>
      </View>
    </View>
  );
}

/** Card order: the offer first. */
const ORDER: Record<Period, number> = { yearly: 0, monthly: 1, weekly: 2 };

export function PlusOffer({
  onDone,
  plan,
  language,
  onStoreUnavailable,
  source,
  header,
}: {
  onDone: () => void;
  /** Rows shown in place of the generic Plus features. Onboarding passes the plan the
   *  learner just built (their apps, their fare, their course), so the wall sells what
   *  already feels like theirs rather than a feature list for a free tier they never
   *  saw (2026-09-29, conversion pass). */
  plan?: { icon: React.ComponentProps<typeof Ionicons>['name']; title: string }[];
  /** The course being sold, for the outcome-led button ("Start speaking Italian free").
   *  Onboarding passes the language just chosen (the profile isn't written until the
   *  end); elsewhere it falls back to the profile's course. */
  language?: Language;
  /**
   * Rendered INSIDE the scroll, above the pitch. Onboarding used to draw its
   * title and the learner's own goal line as a sibling above this component;
   * one extra line there pushed Terms · Privacy off the bottom of a 6.1" phone
   * with no way to reach them (Ralph, build 30). Everything scrolls as one now.
   */
  header?: React.ReactNode;
  /**
   * Onboarding's paywall has no skip — the trial IS the way in. But a wall the
   * store itself cannot open (offline, products not live, StoreKit refusing)
   * must not brick a fresh install, so after a failed purchase attempt this
   * lets the user through. Rendered only when provided.
   */
  onStoreUnavailable?: () => void;
  source: PaywallSource;
}) {
  const theme = useTheme();
  const t = useT();
  const [packages, setPackages] = useState<PlusPackage[]>([]);
  // Yearly is preselected (founder call, 2026-09-28). It was monthly from 2026-09-24,
  // after the first three viewers backed out of "7 days free, then €39.99/year" on
  // Apple's sheet; the answer to that fear is the reminder line above the button,
  // now said plainly instead of inside the legal caption. Falls back to monthly,
  // then to whatever the store returned, if a product is missing.
  const [selected, setSelected] = useState<Period>('yearly');
  const L = useLayout();
  const [busy, setBusy] = useState(false);
  // A failed purchase used to do NOTHING visible: the button pressed, the promise
  // resolved 'error', and the screen sat there. Every failure now says something.
  const [failed, setFailed] = useState(false);
  // Apple's sheet was dismissed without buying: the one moment left to answer the
  // fear and to learn what stopped them (founder call, 2026-09-28).
  const [cancelled, setCancelled] = useState(false);
  // One second chance per visit (Apple allows a single offer after a dismissal):
  // the weekly plan, for whoever balked at the bigger number.
  const [cancelledPeriod, setCancelledPeriod] = useState<Period | null>(null);
  const [weeklyOffered, setWeeklyOffered] = useState(false);

  useEffect(() => {
    // Tagged with the gate that opened it — the number that says which gate
    // converts. Purchases carry the same tag so the two can be joined.
    track('paywall_viewed', { source });
    getPackages().then((pkgs) => {
      setPackages(pkgs);
      if (pkgs.length && !pkgs.some((p) => p.period === 'yearly')) {
        setSelected(pkgs.some((p) => p.period === 'monthly') ? 'monthly' : pkgs[0].period);
      }
    });
  }, []);

  const current = packages.find((p) => p.period === selected);
  const weekly = packages.find((p) => p.period === 'weekly');
  const course = language ?? getState().learningLanguage;
  const courseRaw = t(`lang.${course}` as StringKey);
  // es/fr/it/pt write language names lowercase mid-sentence ("hablar italiano").
  const courseName = ['es', 'fr', 'it', 'pt'].includes(resolvedLocale()) ? courseRaw.toLowerCase() : courseRaw;
  const trial = current?.hasTrial;

  // Plus can arrive while the wall is up without a tap landing here: a purchase
  // that completed after the app was killed on the Apple sheet, a receipt picked
  // up on reinstall, a family member's purchase. The entitlement listener flips
  // the store; the wall must open on its own — a paid user who is told to pay
  // again is the worst outcome a hard paywall can produce.
  const plus = isPlus(useAppState());
  useEffect(() => {
    if (plus) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plus]);

  async function buy(pkg: PlusPackage | undefined = current) {
    if (!pkg || busy) return;
    setBusy(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFailed(false);
    const res = await purchase(pkg, source);
    setBusy(false);
    if (res === 'purchased') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onDone();
      return;
    }
    // 'cancelled' is the user's own choice — silence is right there. 'error' means
    // the store had nothing to sell (products not live, no network, StoreKit
    // refused), and the user deserves to know why the tap did nothing.
    if (res === 'error') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setFailed(true);
    }
    if (res === 'cancelled') setCancelled(true);
    if (res === 'cancelled' && pkg.period !== 'weekly') setCancelledPeriod(pkg.period);
  }

  function cancelReason(reason: 'price' | 'unsure' | 'looking' | 'other') {
    track('purchase_cancel_reason', { reason, period: current?.period, source });
    setCancelled(false);
    // The weekly offer is spent once the sheet has been answered either way.
    if (cancelledPeriod) setWeeklyOffered(true);
  }

  async function onRestore() {
    setBusy(true);
    const ok = await restore();
    setBusy(false);
    if (ok) onDone();
  }

  // ONE scroll container holds everything. An earlier version pinned the cards
  // and CTA in a sibling View after a flex:1 ScrollView — which laid them out
  // past the parent's bottom edge, where iOS still DRAWS them but excludes them
  // from hit testing. The paywall looked perfect and was completely dead: no card
  // could be selected and the buy button did nothing. If the CTA ever needs to be
  // pinned again, the safe shape is a footer OUTSIDE this component, never a
  // sibling of a flexing scroll view.
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      /* The pitch is far shorter than a 13" iPad, so top-aligned it left the
         bottom 40% of the sheet empty and the CTA stranded mid-screen. Centring
         the CONTENT CONTAINER (never a pinned sibling — see the note above)
         keeps the offer as one block in the middle of the window; flexGrow only
         claims slack, so a window too short to hold the pitch still scrolls
         normally and the centring goes inert. */
      contentContainerStyle={[
        { paddingBottom: space.lg },
        L.regular && { flexGrow: 1 },
        L.regular && opticalCenter(L),
      ]}
    >
      {/* One burst when the wall opens: this is the moment the app asks, so it
          should feel like an arrival, not a checkout. */}
      <Confetti colors={[theme.accent, theme.amber, theme.accentSoft, theme.pine]} />
      {header ? <View style={{ marginBottom: space.lg }}>{header}</View> : null}
      <View style={{ gap: space.sm }}>
        {plan
          ? plan.map((r) => <HowRow key={r.title} icon={r.icon} title={r.title} />)
          : PLUS_FEATURES.slice(0, 3).map((f) => <HowRow key={f.title} icon={f.icon} title={t(f.title)} />)}
      </View>

      {/* package cards */}
      <View style={{ marginTop: space.lg, gap: space.sm + 2 }}>
        {packages.length === 0 ? (
          <ActivityIndicator color={theme.accent} />
        ) : (
          // Yearly first: it is the offer, and the first card is the one read.
          [...packages].sort((a, b) => ORDER[a.period] - ORDER[b.period]).map((p) => {
            // Everything shown here is derived from the store's own price and
            // currency — never a frozen string. savingsVsMonthly and
            // perMonthEquivalent return null rather than guess, so a package with
            // nothing honest to say simply shows no badge.
            const on = p.period === selected;
            const savings = savingsVsMonthly(p, packages);
            const perMonth = perMonthEquivalent(p);
            const perWeek = perWeekEquivalent(p);
            const struck = yearOfMonthly(p, packages);
            const best = p.period === 'yearly' && savings !== null;
            const subKey =
              p.period === 'weekly' ? 'plus.perWeek' : p.period === 'monthly' ? 'plus.perMonth' : 'plus.perYear';
            return (
              <PressableScale
                key={p.period}
                onPress={() => setSelected(p.period)}
                style={[
                  styles.pkg,
                  {
                    backgroundColor: on ? withAlpha(theme.accent, 0.10) : theme.fill,
                    borderColor: on ? theme.accent : theme.line,
                  },
                  // Yearly is wrapped like a present: a gold frame and a warm fill,
                  // whether or not it is the one selected.
                  best && {
                    borderColor: theme.amber,
                    borderWidth: 2,
                    backgroundColor: withAlpha(theme.amber, on ? 0.14 : 0.07),
                  },
                ]}
              >
                {best && (
                  <>
                    <Twinkle size={12} color={theme.accentSoft} delay={500} style={{ bottom: -10, right: 26 }} />
                  </>
                )}
                {/* Trial flag on the card's top edge, for the selected plan's trial.
                    The "no free trial" disclosure is always visible too, as a line
                    inside the card (below). Both come from the package's own offer,
                    so granting weekly a trial in App Store Connect flips it with no
                    code change. */}
                {on && p.hasTrial && (
                  <Animated.View
                    entering={FadeIn.duration(160)}
                    style={[
                      styles.trialFlag,
                      {
                        backgroundColor: theme.paper,
                        borderColor: p.hasTrial ? theme.accent : theme.line,
                      },
                    ]}
                  >
                    <Text variant="caption" color={p.hasTrial ? 'accent' : 'inkSoft'} style={{ fontFamily: font.semibold, letterSpacing: 0 }}>
                      {p.hasTrial
                        ? t('plus.cardTrial', { days: p.trialDays })
                        : t('plus.cardNoTrial')}
                    </Text>
                  </Animated.View>
                )}
                {/* The offer, named: yearly is the best value, and says so on its edge,
                    opposite the trial flag. Every number beside it comes from the
                    store's own prices, so the ribbon only shows when it is true. */}
                {best && (
                  <View style={[styles.bestFlag, { backgroundColor: theme.amber }]}>
                    <Ionicons name="gift" size={13} color={GIFT_INK} />
                    <Text variant="caption" style={{ color: GIFT_INK, fontFamily: font.semibold, letterSpacing: 0.6 }}>
                      {t('plus.bestValue')}
                    </Text>
                    {/* Rides the ribbon's corner, so it follows the ribbon's length in
                        every language. */}
                    <Twinkle size={15} color={theme.amber} style={{ top: -11, right: -9 }} />
                  </View>
                )}
                <View style={[styles.radio, { borderColor: on ? theme.accent : theme.inkFaint }]}>
                  {on && <View style={[styles.radioDot, { backgroundColor: theme.accent }]} />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.pkgTop}>
                    <Text variant="bodyMedium">{t(`plus.${p.period}` as const)}</Text>
                    {/* No "Save 58%" pill: the struck price beside the real one says it,
                        and two badges on one card read as noise ("so crowded"). */}
                  </View>
                  {!p.hasTrial ? (
                    // The no-trial disclosure lives inside the card, quiet but always
                    // there. It used to be a flag on the card's top edge, always on,
                    // floating between two cards ("this simply doesn't look right").
                    <Text variant="caption" color="inkFaint" style={{ marginTop: 2, fontFamily: font.body, letterSpacing: 0 }}>
                      {t('plus.cardNoTrial')}
                    </Text>
                  ) : perWeek ? (
                    // Beside a weekly plan at several times this, the weekly figure is
                    // the one that lands.
                    // Secondary to the billed price (guideline 3.1.2): smaller than it, never bigger.
                    <Text variant="caption" style={{ marginTop: 2, fontFamily: font.semibold, letterSpacing: 0, fontSize: 14, color: theme.amber }}>
                      {t('plus.weeklyEquiv', { price: perWeek })}
                    </Text>
                  ) : (
                    perMonth && (
                      <Text variant="caption" color="inkFaint" style={{ marginTop: 2, fontFamily: font.body, letterSpacing: 0 }}>
                        {t('plus.monthlyEquiv', { price: perMonth })}
                      </Text>
                    )
                  )}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  {/* Twelve months of the monthly plan, which is what yearly replaces —
                      beside the price, not above it, where the trial flag sits. */}
                  <View style={styles.priceRow}>
                    {struck && (
                      <Text variant="callout" color="inkFaint" style={{ textDecorationLine: 'line-through' }}>
                        {struck}
                      </Text>
                    )}
                    <Text variant="bodyMedium" style={{ fontFamily: font.semibold, fontSize: 19, lineHeight: 24 }}>
                      {p.priceString}
                    </Text>
                  </View>
                  <Text variant="caption" color="inkFaint" style={{ fontFamily: font.body, letterSpacing: 0 }}>
                    {t(subKey)}
                  </Text>
                </View>
              </PressableScale>
            );
          })
        )}
      </View>

      <Modal visible={cancelled} transparent animationType="slide" onRequestClose={() => setCancelled(false)}>
        <View style={styles.sheetScrim}>
          <View style={[styles.sheet, { backgroundColor: theme.surface, borderColor: theme.line }]}>
            {/* The fear first: Apple's sheet just quoted a price. With a trial, nothing
                is charged today, and saying so plainly brings a share of the reflex
                cancels back. Without a trial there is nothing to reassure about. */}
            {trial && (
              <>
                <Text variant="title">{t('plus.cancelTitle')}</Text>
                <Text variant="callout" color="inkSoft" style={{ marginTop: space.sm }}>
                  {t('plus.cancelBody', { days: current!.trialDays })}
                </Text>
                <Button
                  label={t('plus.startTrial', { days: current!.trialDays })}
                  onPress={() => {
                    setCancelled(false);
                    void buy();
                  }}
                  full
                  fit
                  style={{ marginTop: space.lg }}
                />
              </>
            )}
            {/* The one second chance: the weekly plan, offered once, only to someone
                who balked at a bigger plan. Transaction-abandon offers carry 17% of
                revenue in Superwall's study; Apple allows one, never repeated. */}
            {weekly && cancelledPeriod && !weeklyOffered && (
              <Button
                label={t('plus.cancelWeekly', { price: weekly.priceString })}
                variant="ghost"
                full
                fit
                style={{ marginTop: space.sm }}
                onPress={() => {
                  setWeeklyOffered(true);
                  setCancelled(false);
                  void buy(weekly);
                }}
              />
            )}
            <Text variant="overline" color="inkFaint" style={{ marginTop: trial ? space.xl : 0 }}>
              {t('plus.cancelAsk')}
            </Text>
            <View style={{ marginTop: space.sm, gap: space.xs }}>
              {(
                [
                  ['price', 'plus.cancelPrice'],
                  ['unsure', 'plus.cancelUnsure'],
                  ['looking', 'plus.cancelLooking'],
                  ['other', 'plus.cancelOther'],
                ] as const
              ).map(([key, label]) => (
                <PressableScale
                  key={key}
                  onPress={() => cancelReason(key)}
                  style={[styles.reason, { backgroundColor: theme.fill, borderColor: theme.line }]}
                >
                  <Text variant="bodyMedium">{t(label)}</Text>
                </PressableScale>
              ))}
            </View>
          </View>
        </View>
      </Modal>
      {/* The reminder, said where the decision is made: the fear on a trial paywall is
          being charged without warning, and this line is the answer. It used to sit
          inside the faint legal caption, where nobody reads. */}
      {/* How the free week works, Blinkist-style: today, the reminder, the charge.
          Blinkist measured +23% trial starts and 55% fewer complaints with it; it is
          only honest because lib/notify now sends that reminder to every trial. */}
      {trial && current && (
        <View style={styles.timeline}>
          {(
            [
              ['lock-open', t('plus.tlToday'), t('plus.tlTodayLine')],
              ['notifications', t('plus.tlDay', { day: Math.max(1, current.trialDays - 1) }), t('plus.tlRemindLine')],
              [
                'card',
                t('plus.tlDay', { day: current.trialDays }),
                t('plus.tlChargeLine', {
                  price: `${current.priceString} ${t(
                    current.period === 'weekly' ? 'plus.perWeek' : current.period === 'monthly' ? 'plus.perMonth' : 'plus.perYear',
                  )}`,
                }),
              ],
            ] as const
          ).map(([icon, when, line], i) => (
            <View key={i} style={styles.tlStep}>
              <View style={[styles.tlDot, { backgroundColor: i === 0 ? theme.accent : withAlpha(theme.accent, 0.16) }]}>
                <Ionicons name={icon} size={14} color={i === 0 ? theme.onAccent : theme.accent} />
              </View>
              <Text variant="bodyMedium" center style={{ marginTop: 6, fontSize: 14, lineHeight: 18 }}>
                {when}
              </Text>
              <Text variant="caption" color="inkSoft" center style={{ marginTop: 2, fontFamily: font.body, letterSpacing: 0, lineHeight: 15 }}>
                {line}
              </Text>
            </View>
          ))}
          <View pointerEvents="none" style={[styles.tlRail, { backgroundColor: withAlpha(theme.accent, 0.25) }]} />
        </View>
      )}
      <Button
        // Outcome-led, per course: "Start speaking Italian free". The trial's length
        // and price stay in the line underneath, where they always were.
        label={trial ? t('plus.startSpeaking', { lang: courseName }) : t('plus.subscribe')}
        fit
        // Never pass the handler itself: PressableScale calls it with the touch event,
        // and buy(event) would try to purchase the event (builds 46/47, 2026-10-01).
        onPress={() => void buy()}
        loading={busy}
        disabled={!current}
        full
        style={{ marginTop: space.md }}
      />
      <Text variant="caption" color="inkFaint" center style={{ marginTop: space.sm, fontFamily: font.body, letterSpacing: 0 }}>
        {/* Trial length comes from the selected package's own intro offer, not a
            global constant — otherwise this legal line can misstate the terms of
            a paid subscription when products carry different offers. */}
        {trial
          ? t('plus.trialLegal', {
              // "then €7.99" alone leaves the period to the imagination; say
              // "then €7.99 per month", the same words as the card.
              price: `${current?.priceString ?? ''} ${t(
                current?.period === 'weekly' ? 'plus.perWeek' : current?.period === 'monthly' ? 'plus.perMonth' : 'plus.perYear',
              )}`,
              days: current!.trialDays,
            })
          : t('plus.legal')}
      </Text>
      {failed && (
        <>
          <Text variant="caption" color="danger" center style={{ marginTop: space.sm }}>
            {t('plus.purchaseFailed')}
          </Text>
          {/* The store's own reason. Ugly, and worth it: without it a failed
              purchase is indistinguishable from a broken button. */}
          {!!lastPurchaseError() && (
            <Text variant="caption" color="inkFaint" center style={{ marginTop: 2 }}>
              {lastPurchaseError()}
            </Text>
          )}
        </>
      )}
      {failed && onStoreUnavailable && (
        <PressableScale onPress={onStoreUnavailable} haptic={null} style={styles.link}>
          <Text variant="callout" color="inkSoft" center>
            {t('plus.continueWithout')}
          </Text>
        </PressableScale>
      )}
      {/* No "Maybe later" here. In onboarding the trial is the only door (founder
          call, 2026-09-16); on /paywall the X is the exit. Neither is advertised
          under the CTA — relift dropped theirs for exactly this reason. */}
      {/* One footer line: Restore · Terms · Privacy. Two stacked rows here were
          the ~30pt that decided whether the legal links fit above the home
          indicator. Guideline 3.1.2: Terms of Use and Privacy Policy reachable
          from the subscription screen itself, not only from the store page. */}
      <View style={styles.legalRow}>
        <PressableScale onPress={onRestore} haptic={null} style={styles.legalLink}>
          <Text variant="caption" color="inkSoft" style={FOOTER}>
            {t('plus.restore')}
          </Text>
        </PressableScale>
        <Text variant="caption" color="inkFaint" style={FOOTER}>
          ·
        </Text>
        <PressableScale
          onPress={() => Linking.openURL(LEGAL_URLS.terms)}
          haptic={null}
          accessibilityRole="link"
          style={styles.legalLink}
        >
          <Text variant="caption" color="inkFaint" style={FOOTER}>
            {t('plus.terms')}
          </Text>
        </PressableScale>
        <Text variant="caption" color="inkFaint" style={FOOTER}>
          ·
        </Text>
        <PressableScale
          onPress={() => Linking.openURL(LEGAL_URLS.privacy)}
          haptic={null}
          accessibilityRole="link"
          style={styles.legalLink}
        >
          <Text variant="caption" color="inkFaint" style={FOOTER}>
            {t('plus.privacy')}
          </Text>
        </PressableScale>
      </View>
    </ScrollView>
  );
}

/** Dark ink on the gold ribbon, the same in light and dark themes. */
const GIFT_INK = '#2A1D05';
/** Footer links in the regular face: the typewriter mono made the wall read like a terminal. */
const FOOTER = { fontFamily: font.body, letterSpacing: 0 } as const;

const styles = StyleSheet.create({
  timeline: { flexDirection: 'row', marginTop: space.lg, gap: space.xs },
  tlStep: { flex: 1, alignItems: 'center' },
  tlDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  tlRail: { position: 'absolute', top: 13, left: '17%', right: '17%', height: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  sheetScrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: space.lg,
    paddingBottom: space.xl + space.lg,
  },
  reason: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, paddingVertical: space.md, paddingHorizontal: space.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pkg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    minHeight: 56,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 11, height: 11, borderRadius: 6 },
  // Sits ON the top border (paper fill punches the line through), right-aligned
  // clear of the price column.
  bestFlag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    position: 'absolute',
    top: -11,
    left: 14,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  trialFlag: {
    position: 'absolute',
    top: -11,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    zIndex: 2,
  },
  pkgTop: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  badge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  link: { paddingVertical: 6, paddingHorizontal: space.md, alignSelf: 'center' },
  legalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: space.xs, marginTop: space.xs },
  legalLink: { paddingVertical: 6, paddingHorizontal: 4 },
});
