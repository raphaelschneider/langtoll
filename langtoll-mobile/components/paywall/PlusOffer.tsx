// The Plus offer — feature list + selectable package cards + purchase CTA.
// Shared by the onboarding paywall step and the standalone /paywall route so
// pricing and purchase logic live in exactly one place. Purchases route through
// lib/purchases (real RevenueCat on the dev build, mock in Expo Go/simulator).
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme, space, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';
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
import { useT } from '@/lib/i18n';
import type { PaywallSource } from '@/lib/paywall';
import { isPlus, useAppState } from '@/lib/store';

function HowRow({ icon, title, detail }: { icon: any; title: string; detail: string }) {
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
        <Text variant="callout" color="inkSoft" style={{ marginTop: 1 }}>
          {detail}
        </Text>
      </View>
    </View>
  );
}

/** Card order: the offer first. */
const ORDER: Record<Period, number> = { yearly: 0, monthly: 1, weekly: 2 };

export function PlusOffer({
  onDone,
  onStoreUnavailable,
  source,
  header,
}: {
  onDone: () => void;
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

  async function buy() {
    if (!current || busy) return;
    setBusy(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFailed(false);
    const res = await purchase(current, source);
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
      {header ? <View style={{ marginBottom: space.lg }}>{header}</View> : null}
      <View style={{ gap: space.sm }}>
        {PLUS_FEATURES.slice(0, 3).map((f) => (
          <HowRow key={f.title} icon={f.icon} title={t(f.title)} detail={t(f.detail)} />
        ))}
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
                ]}
              >
                {/* Trial flag on the card's top edge. The GOOD news pops when you
                    pick a plan; the "no free trial" warning is ALWAYS on, because a
                    disclosure the buyer has to tap to discover isn't a disclosure.
                    Text comes from the package's own offer, so granting weekly a
                    trial in App Store Connect flips this with no code change. */}
                {(on || !p.hasTrial) && (
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
                    <Text variant="caption" color={p.hasTrial ? 'accent' : 'inkSoft'}>
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
                  <View style={[styles.bestFlag, { backgroundColor: theme.accent }]}>
                    <Text variant="caption" style={{ color: theme.onAccent, letterSpacing: 0.5, fontWeight: '700' }}>
                      {t('plus.bestValue')}
                    </Text>
                  </View>
                )}
                <View style={[styles.radio, { borderColor: on ? theme.accent : theme.inkFaint }]}>
                  {on && <View style={[styles.radioDot, { backgroundColor: theme.accent }]} />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.pkgTop}>
                    <Text variant="bodyMedium">{t(`plus.${p.period}` as const)}</Text>
                    {savings !== null && (
                      <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                        <Text variant="caption" style={{ color: theme.onAccent, letterSpacing: 0.5 }}>
                          {t('plus.save', { percent: savings })}
                        </Text>
                      </View>
                    )}
                  </View>
                  {perWeek ? (
                    // Beside a weekly plan at several times this, the weekly figure is
                    // the one that lands.
                    <Text variant="caption" color="accent" style={{ marginTop: 2, fontWeight: '600' }}>
                      {t('plus.weeklyEquiv', { price: perWeek })}
                    </Text>
                  ) : (
                    perMonth && (
                      <Text variant="caption" color="inkFaint" style={{ marginTop: 2 }}>
                        {t('plus.monthlyEquiv', { price: perMonth })}
                      </Text>
                    )
                  )}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  {struck && (
                    // Twelve months of the monthly plan, which is what yearly replaces.
                    <Text variant="caption" color="inkFaint" style={{ textDecorationLine: 'line-through' }}>
                      {struck}
                    </Text>
                  )}
                  <Text variant="bodyMedium">{p.priceString}</Text>
                  <Text variant="caption" color="inkFaint">
                    {t(subKey)}
                  </Text>
                </View>
              </PressableScale>
            );
          })
        )}
      </View>

      {/* The reminder, said where the decision is made: the fear on a trial paywall is
          being charged without warning, and this line is the answer. It used to sit
          inside the faint legal caption, where nobody reads. */}
      {trial && (
        <View style={styles.remind}>
          <Ionicons name="notifications" size={16} color={theme.accent} />
          <Text variant="callout" style={{ flexShrink: 1 }}>
            {t('plus.remindLine')}
          </Text>
        </View>
      )}
      <Button
        label={trial ? t('plus.startTrial', { days: current!.trialDays }) : t('plus.subscribe')}
        onPress={buy}
        loading={busy}
        disabled={!current}
        glow
        full
        style={{ marginTop: space.md }}
      />
      <Text variant="caption" color="inkFaint" center style={{ marginTop: space.sm }}>
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
          <Text variant="caption" color="inkSoft">
            {t('plus.restore')}
          </Text>
        </PressableScale>
        <Text variant="caption" color="inkFaint">
          ·
        </Text>
        <PressableScale
          onPress={() => Linking.openURL(LEGAL_URLS.terms)}
          haptic={null}
          accessibilityRole="link"
          style={styles.legalLink}
        >
          <Text variant="caption" color="inkFaint">
            {t('plus.terms')}
          </Text>
        </PressableScale>
        <Text variant="caption" color="inkFaint">
          ·
        </Text>
        <PressableScale
          onPress={() => Linking.openURL(LEGAL_URLS.privacy)}
          haptic={null}
          accessibilityRole="link"
          style={styles.legalLink}
        >
          <Text variant="caption" color="inkFaint">
            {t('plus.privacy')}
          </Text>
        </PressableScale>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  remind: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.xs, marginTop: space.md },
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
