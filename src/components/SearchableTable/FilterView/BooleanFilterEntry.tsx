import { ListItem, ListItemSecondaryAction, Switch, useTheme } from '@mui/material';
import React from 'react';

import { type BooleanFilter } from '../types';
import { ListItemTextWithEllipsis } from './ListItemWithEllipsis';

export interface BooleanFilterProps {
  spacing: number,
  isChecked: boolean,
  filterSettings: BooleanFilter,
  onChange: (newValue: boolean) => void,
}

export const BooleanFilterEntry: React.FC<BooleanFilterProps> = (props) => {
  const { spacing, filterSettings, isChecked, onChange } = props;
  const theme = useTheme();
  return (
    <ListItem sx={{ my: theme.spacing(spacing) }}>
      <ListItemTextWithEllipsis primary={filterSettings.toggleTitle} />
      <ListItemSecondaryAction>
        <Switch
          inputProps={{ 'aria-label': filterSettings.toggleTitle }}
          size="small"
          checked={isChecked}
          onChange={(_event, newValue) => onChange(newValue)}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
