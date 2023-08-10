import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Checkbox, CircularProgress, Collapse, List, ListItem, ListItemButton, useTheme } from '@mui/material';
import React from 'react';

import { FilterOption, MultiSelectFilter } from '../types';
import { ListItemTextWithEllipsis } from './ListItemWithEllipsis';

export interface MultiSelectFilterEntryProps {
  spacing: number;
  open: boolean;
  columnId: string;
  filter: MultiSelectFilter;
  onToggleOpen: () => void;
  onChange: (optionId: string | number, selected: boolean) => void;
  filterValue: Set<string | number> | undefined
}

export const MultiSelectFilterEntry: React.FC<MultiSelectFilterEntryProps> = (props) =>{
  const { spacing, open, columnId, filter, onChange, filterValue, onToggleOpen } = props;

  const theme = useTheme();

  const [isLoading, setIsLoading] = React.useState(true);
  const [computedOptions, setComputedOptions] = React.useState<FilterOption[] | null>(null);

  React.useEffect(() => { setComputedOptions(null); }, [filter]);

  React.useEffect(() => {
    if (!open || computedOptions !== null) {
      return;
    }
    if (typeof filter.options === 'function') {
      const retVal = filter.options();
      if (Array.isArray(retVal)) {
        setIsLoading(false);
        setComputedOptions(retVal);
      } else {
        let active = true;
        setIsLoading(true);
        retVal.then((options) => {
          if (!active) {
            return;
          }
          setComputedOptions(options);
          setIsLoading(false);
        }).catch(() => {
          setComputedOptions([]);
          setIsLoading(false);
        });
        return () => {
          active = false;
        };
      }
      return;
    }
    setComputedOptions(filter.options);
    setIsLoading(false);
  }, [open, filter, computedOptions]);

  return (
    <Box sx={{ my: theme.spacing(spacing) }}>
      <ListItemButton onClick={onToggleOpen}>
        <ListItemTextWithEllipsis primary={filter.dropdownTitle} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        { isLoading || !computedOptions
          ? (<CircularProgress size={20} sx={{ display: 'block', margin: '0.5rem auto' }} />)
          : (
            <List component="div" disablePadding>
              {
                computedOptions.map((option) => {
                  const isChecked = filterValue?.has(option.id) ?? false;
                  const labelId = `filter-selector-${columnId}-${option.id}`;
                  return (
                    <ListItem
                      key={option.id}
                      sx={{ pl: 4, width: '100%' }}
                      disablePadding
                      dense
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          size="small"
                          inputProps={{ 'aria-labelledby': labelId }}
                          checked={isChecked}
                          onChange={(_event, newValue) => onChange(option.id, newValue)}
                        />
                      }
                    >
                      <ListItemTextWithEllipsis primaryTypographyProps={{fontSize: '0.9em'}} id={labelId} primary={option.label} />
                    </ListItem>
                  );
                })
              }
            </List>
          )
        }
      </Collapse>
    </Box>
  );
};
