import { Box, BoxProps } from '@mui/material';
import { Link } from 'react-router-dom';

import { ReactComponent as LogoNoText } from '@/assets/logo-no-text.svg';
import { ReactComponent as LogoTextAside } from '@/assets/logo-text-aside.svg';
import { ReactComponent as LogoTextBelow } from '@/assets/logo-text-below.svg';

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
