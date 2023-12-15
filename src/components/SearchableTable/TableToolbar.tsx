import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import { useIsDesktop } from '@/hooks';

import { ColumnDefinition, FilterModelFromColumnDefinition } from '.';
import { FilterChips } from './FilterView';
import { ConditionalFilter } from './types';

type TableToolbarProps<F extends FilterModelFromColumnDefinition<CD, T>, CD extends ColumnDefinition<T>, T> = {
  numSelected: number;
  title?: string;
  subtitle?: string;
  onToggleFilterClick?: () => void;
} & ConditionalFilter<F, CD, T>

export const TableToolbar = <F extends FilterModelFromColumnDefinition<CD, T>, CD extends ColumnDefinition<T>, T>(props: TableToolbarProps<F, CD, T>)  =>{
  const {
    numSelected,
    title,
    subtitle,
    onToggleFilterClick,
    ...resetFilterChipsProps
  } = props;

  const theme = useTheme();
  const isDesktop = useIsDesktop();

  return (
    <Toolbar
      sx={{
        py: 2,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
        flexWrap: 'wrap',
      }}
    >
      <Box component="div" sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {numSelected > 0 ? (
          <Typography
            color="inherit"
            variant="subtitle1"
            component="span"
          >
            {numSelected} ausgewählt
          </Typography>
        ) : title && (
          <Typography
            variant="h6"
            id="tableTitle"
            component="div"
          >
            { title }
          </Typography>
        )}
        { isDesktop && !!onToggleFilterClick &&
          <>
            <FilterChips stackProps={{ flexWrap: 'wrap', sx: { maxWidth: '75%' } }} showClearAllButton {...resetFilterChipsProps} />
            <Box/>
          </>
        }
        { !isDesktop && !!onToggleFilterClick && (
          <Tooltip title="Filtern">
            <IconButton onClick={() => onToggleFilterClick?.()}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      { subtitle &&
          (
            <Box component="div" sx={{ width: '100%', display: 'flex' }}>
              <Typography variant="subtitle2">
                { subtitle }
              </Typography>
            </Box>
          )
      }
      { !isDesktop && !!onToggleFilterClick &&
        <FilterChips stackProps={{ flexWrap: 'wrap', sx: { width: '100%', mt: theme.spacing(2) } }} showClearAllButton {...resetFilterChipsProps} />
      }
    </Toolbar>
  );
};
