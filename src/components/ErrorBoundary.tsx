import { Link, Typography } from '@mui/material';
import React, {ErrorInfo} from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { CodeBox } from './CodeBox';
import { MainLayout } from './layouts';

type ErrorBoundaryProps = React.PropsWithChildren<{
    messageFromError?: (error: unknown) => string,
}>

class ErrorBoundaryInner extends React.Component<ErrorBoundaryProps, { error: Error | null }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // TODO: log somewhere.
  }

  render(): React.ReactNode {
    if (this.state.error) {
      return (
        <MainLayout>
          <Typography variant='h1' color='error'><strong>Uns is da ä Malläär bassierd</strong></Typography>
          <Typography variant='body1'>
            Leider ist ein Fehler aufgetreten. Folgende Informationen helfen den Entwickler:innen beim Finden des Problems.
          </Typography>
          <Typography variant='body1'>
            Klicken Sie <Link component={RouterLink} to='/'>hier, um zur Startseite zu kommen.</Link>
          </Typography>
          <CodeBox>
            <pre>{ this.props.messageFromError ? this.props.messageFromError(this.state.error) : this.state.error.message }</pre>
            { !!this.state.error.stack && <pre><code>{ this.state.error.stack }</code></pre> }
          </CodeBox>
        </MainLayout>
      );
    }
    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
  const location = useLocation();
  return <ErrorBoundaryInner {...props} key={location.pathname} />;
};
