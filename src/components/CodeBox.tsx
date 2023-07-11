import { styled } from '@mui/material';

export const CodeBox = styled('div')(({theme}) => ({
  fontSize: theme.typography.body2.fontSize,
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  borderWidth: 2,
  borderStyle: 'solid',
}));