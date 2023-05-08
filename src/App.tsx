import { ThemeProvider, createTheme } from '@mui/material';
import { LandingPage } from './pages/LandingPage';


const theme = createTheme();

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LandingPage />
    </ThemeProvider>
  );
};

export default App;
