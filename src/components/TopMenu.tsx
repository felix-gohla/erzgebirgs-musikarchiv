import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';

import { DatabaseSearchField } from './DatabaseSearchField';
import { Logo } from './Logo';
interface TopMenuProps {
  showSearchBar?: boolean;
}

export const TopMenu: React.FC<TopMenuProps> = (props) => {
  const { showSearchBar = false } = props;

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
          showSearchBar && (
            <>
              <Box sx={{ flexGrow: 1, height: '100%' }} />
              <DatabaseSearchField variant="growing" />
              <Box sx={{ flexGrow: 1, display: { 'sm': 'none', 'md': 'initial' } }} />
            </>
          )
        }
      </Toolbar>
    </AppBar>
  );
};