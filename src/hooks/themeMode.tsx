import { useContext } from 'react';

import { ThemeModeContext } from '@/contexts';

export const useThemeMode = () => useContext(ThemeModeContext);
