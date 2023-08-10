import { debounce, ListItem, TextField, useTheme } from '@mui/material';
import React from 'react';

export interface TextFilterEntryProps {
  spacing: number;
  title: string;
  filterValue: string;
  onChange: (newValue: string) => void;
  debounceInputDelay?: number;
}

export const TextFilterEntry: React.FC<TextFilterEntryProps> = (props) => {
  const {
    spacing,
    title,
    filterValue,
    onChange,
    debounceInputDelay = 500,
  } = props;
  const theme = useTheme();

  const [inputValue, setInputValue] = React.useState(filterValue || '');

  React.useEffect(() => {
    if (!filterValue) {
      // Reset detected.
      setInputValue('');
    }
  }, [setInputValue, filterValue]);

  const debouncedChangeCallback = React.useMemo(() => debounce(onChange, debounceInputDelay), [onChange, debounceInputDelay]);

  const inputCallback: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = React.useCallback((event) => {
    setInputValue(event.target.value);
    debouncedChangeCallback(event.target.value);
  }, [debouncedChangeCallback]);

  return (
    <ListItem
      sx={{ my: theme.spacing(spacing) }}
    >
      <TextField
        label={title}
        size='small'
        fullWidth
        value={inputValue}
        onChange={inputCallback}
      />
    </ListItem>
  );
};
