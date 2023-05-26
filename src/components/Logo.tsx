import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Box, BoxProps, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const Logo: React.FC<BoxProps<'a'>> = (boxProps) => {
  const { sx, ...rest } = boxProps;
  return (
    <Box
      {...rest}
      sx={{
        ...sx,
        color: 'inherit',
        textDecoration: 'none',
        minWidth: '200px',
        alignItems: 'center',
        display: 'flex',
        position: 'absolute',
      }}
      component={Link}
      to="/"
    >
      <MusicNoteIcon sx={{ display: 'inline', mr: 1 }} />
      <Typography
        variant="h6"
        noWrap
        sx={{
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          display: 'inline',
        }}
      >
        MUSIKDB
      </Typography>
    </Box>
  );
};
