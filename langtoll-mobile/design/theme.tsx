// Theme context. LangToll defaults to its nocturnal look, but the appearance is
// user-controllable (Settings → Appearance): 'dark' | 'light' | 'system'.
// The choice lives in the store (persisted); this provider resolves it — with
// the device color scheme — into the active Theme.
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type Theme } from './tokens';
import { useAppState } from '@/lib/store';

const ThemeContext = createContext<Theme>(darkTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { appearance } = useAppState();
  const system = useColorScheme();
  const scheme =
    appearance === 'system' ? (system === 'light' ? 'light' : 'dark') : appearance;
  const theme = scheme === 'light' ? lightTheme : darkTheme;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export { space, radius, type, font, shadow, palette } from './tokens';
export type { Theme } from './tokens';
