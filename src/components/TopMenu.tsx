import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { AppBar, Box, Button, IconButton, Toolbar, Tooltip, useTheme } from '@mui/material';
import React from 'react';

import { useIsDesktop, useThemeMode } from '@/hooks';

import { DatabaseSearchField } from './DatabaseSearchField';
import { Logo } from './Logo';
interface TopMenuProps {
  showSearchBar?: boolean;
}

export const TopMenu: React.FC<TopMenuProps> = (props) => {
  const { showSearchBar = false } = props;

  const theme = useTheme();
  const { themeMode, setThemeMode } = useThemeMode();

  const desktop = useIsDesktop();

  const handleThemeChange = React.useCallback(() => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  }, [themeMode, setThemeMode]);

  const themeModeIcon = themeMode === 'light' ? <LightModeIcon /> : <DarkModeIcon />;
  const themeModeString = themeMode === 'light' ? 'Heller Modus' : 'Dunkler Modus';

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Logo
          useLink
          sx={{
            mr: 2,
            my: 2,
            display: showSearchBar ? { xs: 'none' } : undefined,
          }}
          width={{ xs: 128, sm: 192 }}
        />
        {
          showSearchBar
            ? (
              <>
                <Box sx={{ flexGrow: 1, height: '100%' }} />
                <DatabaseSearchField variant="growing" />
                <Box sx={{ flexGrow: 1, display: { 'sm': 'none', 'md': 'initial' } }} />
              </>
            )
            : <Box sx={{ flex: 1 }} />
        }
        { desktop
          ? <Button
            sx={{ color: 'inherit', whiteSpace: 'nowrap', ml: theme.spacing(1) }}
            aria-labelledby="theme-mode-label"
            onClick={handleThemeChange}
            endIcon={themeModeIcon}
          >
            { themeModeString }
          </Button>
          : <Tooltip title={themeModeString}>
            <IconButton onClick={handleThemeChange} sx={{ color: 'inherit', ml: theme.spacing(1) }}>{ themeModeIcon }</IconButton>
          </Tooltip>
        }
      </Toolbar>
    </AppBar>
  );
};