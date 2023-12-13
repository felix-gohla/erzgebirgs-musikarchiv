import { Box, BoxProps } from '@mui/material';
import { Link } from 'react-router-dom';

import LogoNoText from '@/assets/logo-no-text.svg?react';
import LogoTextAside from '@/assets/logo-text-aside.svg?react';
import LogoTextBelow from '@/assets/logo-text-below.svg?react';

type LogoBaseProps = {
  variant?: 'text-below' | 'text-aside' | 'no-text',
}
type LogoPropsWithLink = LogoBaseProps & BoxProps<'a'> & {
  useLink: true,
}

type LogoPropsWithoutLink = LogoBaseProps & BoxProps<'div'> & {
  useLink?: false,
}

type LogoProps = LogoPropsWithLink | LogoPropsWithoutLink;

export const Logo: React.FC<LogoProps> = (props) => {
  const { variant = 'text-aside', ...rest } = props;
  let logo: React.ReactNode;
  if (variant === 'text-below') {
    logo = <LogoTextBelow fill='currentColor' />;
  } else if (variant === 'text-aside') {
    logo = <LogoTextAside fill='currentColor' />;
  } else {
    logo = <LogoNoText fill='currentColor' />;
  }

  if (!rest.useLink) {
    const { sx, useLink: _useLink, ...propsRest } = rest;
    return (<Box
      {...propsRest}
      sx={{
        ...sx,
        color: 'inherit',
        textDecoration: 'none',
        alignItems: 'center',
        display: 'flex',
      }}
      component = 'div'
    >
      { logo }
    </Box>);
  }

  const { sx, useLink: _useLink, ...propsRest } = rest;
  return (
    <Box
      {...propsRest}
      sx={{
        ...sx,
        color: 'inherit',
        textDecoration: 'none',
        alignItems: 'center',
        display: 'flex',
      }}
      component={Link}
      to="/"
    >
      { logo }
    </Box>
  );
};
