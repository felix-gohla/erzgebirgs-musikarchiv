import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Logo } from './Logo';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '28ch',
      '&:focus': {
        width: '64ch',
      },
    },
  },
}));

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
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Suchen…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
              <Box sx={{ flexGrow: 1, display: { 'sm': 'none', 'md': 'initial' } }} />
            </>
          )
        }
      </Toolbar>
    </AppBar>
  );
};