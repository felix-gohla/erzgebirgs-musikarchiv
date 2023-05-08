import { Box, BoxProps, Typography } from '@mui/material';

export const Logo: React.FC<BoxProps> = (boxProps) => (
  <Box {...boxProps}>
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="/"
      sx={{
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
        MUSIKDB
    </Typography>
  </Box>
)
