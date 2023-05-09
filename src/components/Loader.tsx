import { Box, BoxProps, CircularProgress, Typography, useTheme } from '@mui/material';
import React from 'react';

interface LoaderProps {
  /**
   * A text to display.
   */
  text?: string;

  /**
   * Additional configuration options for the container.
   */
  boxProps?: BoxProps
}

export const Loader: React.FC<LoaderProps> = (props) => {
  const { boxProps, text } = props;
  const { sx, ...rest } = boxProps || {};

  const theme = useTheme();

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
        ...sx,
      }}
      {...rest}
    >
      <CircularProgress sx={{ mb: theme.spacing(3) }} />
      <Typography variant="subtitle1">{ text }</Typography>
    </Box>
  );
};