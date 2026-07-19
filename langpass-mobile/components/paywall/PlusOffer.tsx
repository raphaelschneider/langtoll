// The Plus offer — feature list + selectable package cards + purchase CTA.
// Shared by the onboarding paywall step and the standalone /paywall route so
// pricing and purchase logic live in exactly one place. Purchases route through
// lib/purchases (real RevenueCat on the dev build, mock in Expo Go/simulator).
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme, space, radius } from '@/design/theme';
import { PLUS_FEATURES, type Period } from '@/lib/plans';
import {
  getPackages,
  purchase,
  restore,
  perMonthEquivalent,
  savingsVsMonthly,
  type PlusPackage,
} from '@/lib/purchases';
import { useT } from '@/lib/i18n';

function HowRow({ icon, title, detail }: { icon: any; title: string; detail: string }) {
  const theme = useTheme();
  return (
    <View style={styles.featureRow}>
      <View
        style={[styles.featureIcon, { backgroundColor: 'rgba(200,255,77,0.10)', borderColor: 'rgba(200,255,77,0.3)' }]}
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

export function PlusOffer({ onDone }: { onDone: () => void }) {
  const theme = useTheme();
  const t = useT();
  const [packages, setPackages] = useState<PlusPackage[]>([]);
  const [selected, setSelected] = useState<Period>('yearly');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getPackages().then((pkgs) => {
      setPackages(pkgs);
      if (pkgs.length && !pkgs.some((p) => p.period === 'yearly')) setSelected(pkgs[0].period);
    });
  }, []);

  const current = packages.find((p) => p.period === selected);
  const trial = current?.hasTrial;

  async function buy() {
    if (!current || busy) return;
    setBusy(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const res = await purchase(current);
    setBusy(false);
    if (res === 'purchased') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onDone();
    }
  }

  async function onRestore() {
    setBusy(true);
    const ok = await restore();
    setBusy(false);
    if (ok) onDone();
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ gap: space.sm }}>
        {PLUS_FEATURES.slice(0, 3).map((f) => (
          <HowRow key={f.title} icon={f.icon} title={f.title} detail={f.detail} />
        ))}
      </View>

      {/* package cards */}
      <View style={{ marginTop: space.lg, gap: space.sm }}>
        {packages.length === 0 ? (
          <ActivityIndicator color={theme.accent} />
        ) : (
          packages.map((p) => {
            // Everything shown here is derived from the store's own price and
            // currency — never a frozen string. savingsVsMonthly and
            // perMonthEquivalent return null rather than guess, so a package with
            // nothing honest to say simply shows no badge.
            const on = p.period === selected;
            const savings = savingsVsMonthly(p, packages);
            const perMonth = perMonthEquivalent(p);
            const subKey =
              p.period === 'weekly' ? 'plus.perWeek' : p.period === 'monthly' ? 'plus.perMonth' : 'plus.perYear';
            return (
              <PressableScale
                key={p.period}
                onPress={() => setSelected(p.period)}
                style={[
                  styles.pkg,
                  {
                    backgroundColor: on ? 'rgba(200,255,77,0.10)' : theme.fill,
                    borderColor: on ? theme.accent : theme.line,
                  },
                ]}
              >
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
                  {perMonth && (
                    <Text variant="caption" color="inkFaint" style={{ marginTop: 2 }}>
                      {t('plus.monthlyEquiv', { price: perMonth })}
                    </Text>
                  )}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
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
          ? t('plus.trialLegal', { price: current?.priceString ?? '', days: current!.trialDays })
          : t('plus.legal')}
      </Text>

      <View style={styles.linksRow}>
        <PressableScale onPress={onRestore} haptic={null} style={styles.link}>
          <Text variant="callout" color="inkSoft">
            {t('plus.restore')}
          </Text>
        </PressableScale>
        <PressableScale onPress={onDone} haptic={null} style={styles.link}>
          <Text variant="callout" color="inkFaint">
            {t('plus.later')}
          </Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  pkgTop: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  badge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  linksRow: { flexDirection: 'row', justifyContent: 'center', gap: space.xl, marginTop: space.sm },
  link: { paddingVertical: 6, paddingHorizontal: space.md },
});
