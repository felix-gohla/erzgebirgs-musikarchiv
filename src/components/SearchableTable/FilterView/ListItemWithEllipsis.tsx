import { ListItemText, ListItemTextProps } from '@mui/material';

export const ListItemTextWithEllipsis: React.FC<ListItemTextProps> = (props) => {
  const { primaryTypographyProps, ...rest } = props;
  return <ListItemText
    primaryTypographyProps={{
      ...primaryTypographyProps,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'block',
      overflow: 'hidden',
      width: 'calc(100% - 36px)',
    }}
    {...rest}
  />;
};