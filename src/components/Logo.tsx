import { Box, BoxProps } from '@mui/material';
import { Link } from 'react-router-dom';

import { ReactComponent as LogoTextAside } from '@/assets/logo-text-aside.svg';
import { ReactComponent as LogoTextBelow } from '@/assets/logo-text-below.svg';

type LogoBaseProps = {
  variant?: 'text-below' | 'text-aside',
}
type LogoPropsWithLink = LogoBaseProps & BoxProps<'a'> & {
  useLink: true,
}

type LogoPropsWithoutLink = LogoBaseProps & BoxProps<'div'> & {
  useLink?: false,
}

type LogoProps = LogoPropsWithLink | LogoPropsWithoutLink;

export const Logo: React.FC<LogoProps> = (props = { variant: 'text-below', useLink: true }) => {
  const logo = props.variant === 'text-below' ? <LogoTextBelow fill='currentColor' /> : <LogoTextAside fill='currentColor' />;

  if (!props.useLink) {
    const { sx, useLink: _useLink,  ...rest } = props;
    return (<Box
      {...rest}
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

  const { sx, useLink: _useLink, ...rest } = props;
  return (
    <Box
      {...rest}
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
