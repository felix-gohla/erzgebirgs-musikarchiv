import { createContext } from 'react';

export type ThemeMode = 'dark' | 'light';

export const ThemeModeContext = createContext<{ themeMode: ThemeMode, setThemeMode: (mode: ThemeMode) => void }>({
  themeMode: 'dark',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setThemeMode: () => {},
});

