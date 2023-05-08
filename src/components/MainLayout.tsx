import { Box } from '@mui/material';
import { TopMenu } from './TopMenu';

export const MainLayout: React.FC<React.PropsWithChildren<Record<never, never>>> = (props) => {
  const { children } = props;
  return (
    <>
      <TopMenu showSearchBar />
      <Box component="main">
        { children }
      </Box>
    </>
  );
};
