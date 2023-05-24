import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, CircularProgress, debounce, InputAdornment, TextField } from '@mui/material';
import React, { ReactNode, useState } from 'react';

interface SearchFieldProps<T> {
  onChange?: (newValue: T | string | null) => void,
  fetchOptions: (searchTerm: string) => Promise<T[]>,
  isOptionEqualToValue: (option: T, value: T) => boolean,
  getOptionLabel: (option: T | string) => string,
  /**
   * A debounce time in milliseconds.
   */
  searchDebounce?: number,
  label: string,
}


export const SearchField = <T,>(props: SearchFieldProps<T>) => {
  const {
    fetchOptions,
    getOptionLabel,
    isOptionEqualToValue,
    label,
    onChange,
    searchDebounce = 250,
  } = props;

  const [shrink, setShrink] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly T[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const loading = open && isFetching;
  const [searchTerm, setSearchTerm] = useState('');
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

  return (
    <Autocomplete
      freeSolo
      filterSelectedOptions={false}
      filterOptions={(some: T[]) => some}
      open={open}
      onChange={(_event, data): void => {
        onChange?.(data);
      }}
      onOpen={(): void => {
        setOpen(true);
      }}
      onClose={(): void => {
        setOpen(false);
        setSearchTerm('');
      }}
      onInputChange={(_event, newInput): void => searchDelayed(newInput)}
      value={searchTerm}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      loadingText="Lädt…"
      renderInput={(params): ReactNode => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            type: 'search',
            startAdornment: (<InputAdornment position="start" sx={{ ml: -0.5, mr: 1 }}><SearchIcon /></InputAdornment>),
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          sx={{
            '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
              transform: 'translate(41px, 17px)',
            },
          }}
          onFocus={(): void => setShrink(true)}
          onBlur={(e): void => {
            !e.target.value && setShrink(false);
          }}
          InputLabelProps={{
            shrink: shrink,
          }}
        />
      )}
    />
  );
};
