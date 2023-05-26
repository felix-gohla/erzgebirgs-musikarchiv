import SearchIcon from '@mui/icons-material/Search';
import { alpha, Autocomplete, AutocompleteProps, AutocompleteRenderGroupParams, CircularProgress, debounce, InputAdornment, TextField, useTheme } from '@mui/material';
import React, { ReactNode, useState } from 'react';

export interface SearchFieldProps<T> {
  onChange?: (newValue: T | string | null) => void,
  fetchOptions: (searchTerm: string) => Promise<T[]>,
  isOptionEqualToValue: (option: T, value: T) => boolean,
  getOptionLabel: (option: T | string) => string,
  /**
   * A debounce time in milliseconds.
   */
  searchDebounce?: number,
  label: string,
  variant?: 'standard' | 'growing',
  groupBy?: (option: T) => string,
  renderGroup?: (params: AutocompleteRenderGroupParams) => React.ReactNode
}

export const SearchField = <T,>(props: SearchFieldProps<T>) => {
  const {
    fetchOptions,
    getOptionLabel,
    isOptionEqualToValue,
    label,
    onChange,
    searchDebounce = 250,
    variant = 'standard',
    groupBy,
    renderGroup,
  } = props;

  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly T[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const loading = open && isFetching;
  const [searchTerm, setSearchTerm] = useState('');
  const [textFieldValue, setTextFieldValue] = useState('');
  React.useEffect(() => {
    let active = true;
    setIsFetching(true);

    if (!open) {
      return undefined;
    }

    (async (): Promise<void> => {
      try {
        const obs = await fetchOptions(searchTerm);

        if (active) {
          setOptions([...obs]);
        }
      } finally {
        setIsFetching(false);
      }
    })();

    return (): void => {
      active = false;
      setIsFetching(false);
    };
  }, [open, fetchOptions, searchTerm, setIsFetching]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  // Debounce the search.
  const searchDelayed = React.useMemo(
    () => debounce(setSearchTerm, searchDebounce),
    [setSearchTerm, searchDebounce],
  );

  const shrink = React.useMemo(() => !!textFieldValue || open, [textFieldValue, open]);

  let autocompleteSx: AutocompleteProps<T, true, false, true>['sx'] = {};
  if (variant === 'growing') {
    autocompleteSx = {
      width: '28ch',
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitions.create('width'),
      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.15) : theme.palette.background.paper,
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.25) : theme.palette.background.paper,
      },
      '&.Mui-focused': {
        width: '64ch',
      },
      '& .MuiOutlinedInput-root': {
        padding: '4px 8px',
        '& fieldset': {
          border: '0',
        },
        '&:hover fieldset': {
          border: '0',
        },
        '&.Mui-focused fieldset': {
          border: '0',
        },
      },
      '& .MuiInputLabel-root.MuiInputLabel-shrink': {
        opacity: 0,
      },
    };
  }

  return (
    <Autocomplete
      freeSolo
      filterSelectedOptions={false}
      filterOptions={(some: T[]) => some}
      open={open}
      groupBy={groupBy}
      renderGroup={renderGroup}
      onChange={(_event, data): void => {
        onChange?.(data);
      }}
      onOpen={(): void => {
        setOpen(true);
      }}
      onClose={(): void => {
        setOpen(false);
      }}
      onInputChange={(_event, newInput): void => {
        setTextFieldValue(newInput);
        searchDelayed(newInput);
      }}
      value={searchTerm}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      options={options}
      blurOnSelect
      loading={loading}
      loadingText="Lädt…"
      noOptionsText="Nichts gefunden"
      sx={autocompleteSx}
      renderInput={(params): ReactNode => (
        <TextField
          {...params}
          size={variant === 'growing' ? 'small' : 'medium'}
          label={label}
          InputProps={{
            ...params.InputProps,
            type: 'search',
            startAdornment: (<InputAdornment position="start" sx={{ ml: 0, mr: 0 }}><SearchIcon /></InputAdornment>),
            endAdornment: (
              <React.Fragment>
                { loading ? <CircularProgress color="inherit" size={20} /> : null }
                { params.InputProps.endAdornment }
              </React.Fragment>
            ),
          }}
          sx={{
            '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
              transform: variant === 'growing' ? 'translate(37px, 10px)' : 'translate(41px, 17px)',
            },
            '& ::-webkit-search-cancel-button': {
              display: 'none',
            },
          }}
          InputLabelProps={{
            shrink,
          }}
        />
      )}
    />
  );
};
