import { Box } from '@mui/material';
import { TopMenu } from './TopMenu';

export const LandingLayout: React.FC<React.PropsWithChildren<Record<never, never>>> = (props) => {
  const { children } = props;
  return (
    <>
      <TopMenu />
      <Box component="main">
        { children }
      </Box>
    </>
  );
};
