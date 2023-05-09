import { Container, useTheme } from '@mui/material';

import { TopMenu } from './TopMenu';

export const MainLayout: React.FC<React.PropsWithChildren<Record<never, never>>> = (props) => {
  const { children } = props;
  const theme = useTheme();

  return (
    <>
      <TopMenu showSearchBar />
      <Container
        component="main"
        maxWidth="xl"
        sx={{ flexGrow: 1, py: theme.spacing(4), position: 'relative' }}
      >
        { children }
      </Container>
    </>
  );
};
