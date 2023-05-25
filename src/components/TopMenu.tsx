import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';

import { Logo } from './Logo';
import { SongSearchField } from './SongSearchField';
interface TopMenuProps {
  showSearchBar?: boolean;
}

export const TopMenu: React.FC<TopMenuProps> = (props) => {
  const { showSearchBar = false } = props;

  return (
    <AppBar position="sticky">
      <Toolbar>
        <MusicNoteIcon sx={{ display: 'flex', mr: 1 }} />
        <Logo sx={{
          mr: 2,
          display: showSearchBar ? { xs: 'none', md: 'flex' } : undefined,
        }} />
        {
          showSearchBar && (
            <>
              <Box sx={{ flexGrow: 1, height: '100%' }} />
              <SongSearchField variant="growing" />
              <Box sx={{ flexGrow: 1, display: { 'sm': 'none', 'md': 'initial' } }} />
            </>
          )
        }
      </Toolbar>
    </AppBar>
  );
};