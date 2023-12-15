import CloseIcon from '@mui/icons-material/Close';
import FilterIcon from '@mui/icons-material/FilterList';
import {
  AppBar,
  Box,
  BoxProps,
  Button,
  Checkbox,
  CircularProgress,
  debounce,
  Dialog,
  IconButton,
  Paper,
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import deepEqual from 'deep-equal';
import React from 'react';

import { useFiltersFromUrl, useIsDesktop } from '@/hooks';

import { FilterView } from './FilterView';
import { SortableTableHead } from './SortableTableHead';
import { TableRowsLoadingAnimation } from './TableRowsLoadingAnimation';
import { TableToolbar } from './TableToolbar';
import { ColumnDefinition, columnDefinitionToArray, FilterModelFromColumn, FilterModelFromColumnDefinition, LoadDataCallback, Order, TypeWithId } from './types';

export { type Column, type ColumnDefinition, type FilterModelFromColumnDefinition, type LoadDataCallback } from './types';

const FilterDialogTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type SearchableTableProps<C extends ColumnDefinition<T>, T extends TypeWithId> = {
  totalRowCount: number,
  loadData: LoadDataCallback<T, C>,
  columns: C,
  defaultOrder: keyof T & string,
  title?: string,
  subtitle?: string,
  sx?: BoxProps<'div'>['sx'],
  initialFilter?: FilterModelFromColumnDefinition<C, T>,
  onFilterChange?: (filterModel: FilterModelFromColumnDefinition<C, T>) => void | PromiseLike<void>,
  filterChangeDebounce?: number,
  useUrlFiltering?: boolean,
  noDataText?: string,
  isLoading?: boolean,
} & ({
  enableSelection: false,
  onClick?: (event: React.MouseEvent, id: T['id']) => void | Promise<void>,
} | {
  enableSelection: true,
  onSelect?: (ids: readonly T['id'][]) => void | Promise<void>,
})

export const SearchableTable = <C extends ColumnDefinition<T>, T extends TypeWithId>(props: SearchableTableProps<C, T>) => {
  const {
    defaultOrder,
    columns,
    title: tableTitle,
    enableSelection = false,
    loadData,
    subtitle,
    sx,
    totalRowCount,
    initialFilter,
    onFilterChange,
    filterChangeDebounce = 500,
    useUrlFiltering = false,
    noDataText,
    isLoading: isLoadingOverwrite,
  } = props;

  // Base hooks.
  const theme = useTheme();
  const isDesktop = useIsDesktop();

  // Table hooks.
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T & string>(defaultOrder);
  const [selected, setSelected] = React.useState<readonly T['id'][]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [rows, setRows] = React.useState<T[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const isLoading = isLoadingData || isLoadingOverwrite;
  const numLoadingAnimationRows = Math.min(totalRowCount, rowsPerPage);

  // Column handling.
  const filterableColumns = React.useMemo(
    () => {
      return columnDefinitionToArray(columns)
        .filter(([_, column]) => !!column.filterSettings)
        .sort(([_, column]) => column.filterSettings?.order || 0);
    },
    [columns],
  );
  const { filtersInUrl, setFiltersInUrl, previousFiltersInUrl } = useFiltersFromUrl<T, C>(columns);
  const getFilterModelFromUrl = React.useCallback((currentFilterModel: FilterModelFromColumnDefinition<C, T>, currentFiltersInUrl: typeof filtersInUrl) => {
    const newFilterModel = { ...(currentFilterModel || {}) };
    filterableColumns.forEach(([columnId, column]) => {
      const filterType = column.filterSettings?.type;
      if (!filterType) {
        return;
      }
      const filterValueFromUrl = currentFiltersInUrl[columnId];
      if (filterValueFromUrl !== undefined) {
        switch (filterType) {
        case 'boolean':
          newFilterModel[columnId] = {
            columnId,
            filterType,
            ...(newFilterModel[columnId]),
            filterValue: !!filterValueFromUrl,
          } as FilterModelFromColumn<C, T, keyof T & string>;
          break;
        case 'text':
        case 'multi-select':
          newFilterModel[columnId] = {
            columnId,
            filterType,
            ...(newFilterModel[columnId]),
            filterValue: filterValueFromUrl,
          } as FilterModelFromColumn<C, T, keyof T & string>;
          break;
        default:
          break;
        }
      }
    });
    return newFilterModel;
  }, [filterableColumns]);
  const [filterModel, setFilterModel] = React.useState<FilterModelFromColumnDefinition<C, T>>(
    initialFilter || (useUrlFiltering ? getFilterModelFromUrl(initialFilter || {}, filtersInUrl): {}),
  );

  const debouncedFilterChangeCallback = React.useMemo(() => {
    return debounce((newFilterModel: FilterModelFromColumnDefinition<C, T>) => {
      onFilterChange?.(newFilterModel);
      if (useUrlFiltering) {
        setFiltersInUrl(newFilterModel);
      }
    }, filterChangeDebounce);
  }, [useUrlFiltering, onFilterChange, filterChangeDebounce, setFiltersInUrl]);
  const internalFilterChangeCallback: typeof onFilterChange = React.useMemo(() => (newModel) => {
    if (deepEqual(newModel, filterModel)) {
      return;
    }
    setFilterModel(newModel);
    debouncedFilterChangeCallback?.(newModel);
  }, [filterModel, debouncedFilterChangeCallback]);

  React.useEffect(() => {
    if (!useUrlFiltering) {
      return;
    }
    if (deepEqual(previousFiltersInUrl, filtersInUrl)) {
      return;
    }
    const newFilterModel = getFilterModelFromUrl(filterModel, filtersInUrl);
    if (deepEqual(newFilterModel, filterModel)) {
      return;
    }
    setFilterModel(newFilterModel);
  }, [useUrlFiltering, filterModel, filtersInUrl, getFilterModelFromUrl, previousFiltersInUrl]);

  // Data fetching.
  React.useEffect(
    () => {
      let active = true;
      setIsLoadingData(true);

      loadData(page * rowsPerPage, Math.min(rowsPerPage, totalRowCount), order, orderBy, filterModel).then((fetchedData) => {
        if (active === true) {
          setIsLoadingData(false);
          setRows(fetchedData);
        }
      }).catch(() => {
        if (active === true) {
          setIsLoadingData(false);
        }
      });

      return () => {
        active = false;
      };
    },
    [page, rowsPerPage, totalRowCount, order, orderBy, filterModel, loadData],
  );


  // Table handlers.
  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof T & string,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      if (props.enableSelection) {
        props.onSelect?.(newSelected);
      }
      setSelected(newSelected);
      return;
    }
    if (props.enableSelection) {
      props.onSelect?.([]);
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent, id: T['id']) => {
    if (!props.enableSelection) {
      props.onClick?.(event, id);
      return;
    }

    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly T['id'][] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    props.onSelect?.(newSelected);
    setSelected(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: T['id']) => (!enableSelection ? false : (selected.indexOf(id) !== -1));

  // Filtering & Filter dialog.
  const showFilters = filterableColumns.length > 0;
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  React.useEffect(() => {
    if (!isDesktop) {
      // Make sure to close filter dialog when transitioning from larger to smaller screen.
      setFilterDialogOpen(false);
    }
  }, [isDesktop]);
  const handleFilterDialogOpen = React.useCallback(() => {
    setFilterDialogOpen(true);
  }, []);
  const handleFilterDialogClose = React.useCallback(() => {
    setFilterDialogOpen(false);
  }, []);

  const boxSx = React.useMemo(() => ({ width: '100%', ...sx }), [sx]);
  const paperSx = React.useMemo(() => ({ mb: 2, flexGrow: 1 }), []);

  return (
    <Box component='div' sx={boxSx}>
      <Paper sx={paperSx} elevation={3}>
        <TableToolbar<FilterModelFromColumnDefinition<C, T>, C, T>
          title={tableTitle}
          subtitle={subtitle}
          numSelected={selected.length}
          columns={columns}
          filter={filterModel}
          onFilterChange={internalFilterChangeCallback}
          onToggleFilterClick={showFilters ? handleFilterDialogOpen : undefined}
        />
        <Stack direction="row" sx={{ flex: 1 }}>
          {
            showFilters
              ? (
                isDesktop
                  ? (
                    <Box sx={{ minWidth: 250, maxWidth: 250, pr: theme.spacing(1) }}>
                      <Box sx={{ width: '100%', textAlign: 'center', mt: theme.spacing(1), mb: theme.spacing(1) }}>
                        <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} gap={1}>
                          <FilterIcon fontSize='inherit' />
                            Filter
                        </Typography>
                      </Box>
                      <FilterView<C, T>
                        columns={columns}
                        filterModel={filterModel}
                        onChange={internalFilterChangeCallback}
                      />
                    </Box>
                  )
                  : (
                    <Dialog
                      fullScreen
                      open={filterDialogOpen}
                      onClose={handleFilterDialogClose}
                      TransitionComponent={FilterDialogTransition}
                    >
                      <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                          <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleFilterDialogClose}
                            aria-label="close"
                          >
                            <CloseIcon />
                          </IconButton>
                          <Typography sx={{ ml: 2 }} variant="h6" component="div">
                              Filter
                          </Typography>
                          { isLoading && <CircularProgress sx={{ mx: theme.spacing(2) }} size='1em' /> }
                          <Box sx={{ flex: 1 }} />
                          <Button autoFocus color="inherit" onClick={handleFilterDialogClose}>
                            Anwenden
                          </Button>
                        </Toolbar>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', py: theme.spacing(1) }}>
                          <Typography variant='overline' sx={{ textAlign: 'center' }}>
                            { isLoading
                              ? <CircularProgress sx={{ mx: theme.spacing(2) }} size='1em' />
                              : <strong>{ totalRowCount } { totalRowCount !== 1 ? 'Einträge' : 'Eintrag' } gefunden</strong>
                            }
                          </Typography>
                        </Box>
                        <Box sx={{ width: '100%', px: theme.spacing(1) }}>
                          <FilterView<C, T>
                            columns={columns}
                            filterModel={filterModel}
                            onChange={internalFilterChangeCallback}
                          />
                        </Box>
                      </AppBar>
                    </Dialog>
                  )
              )
              : null
          }
          <TableContainer>
            <Table
              aria-labelledby="tableTitle"
              size="medium"
            >
              <SortableTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={columns}
                enableSelection={enableSelection}
              />
              <TableBody>
                {isLoading && <TableRowsLoadingAnimation numColumns={Object.keys(columns).length} numRows={numLoadingAnimationRows} />}
                {rows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => { handleClick(event, row.id); return false; }}
                      role={enableSelection ? 'checkbox' : 'row'}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      { enableSelection && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                      )}
                      {
                        columnDefinitionToArray(columns).map(([id, column]) => {
                          const sx: TableCellProps['sx'] = {
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                          };
                          if (column.renderRow) {
                            return (
                              <TableCell sx={sx} key={id} align={column.align || 'left'}>{column.renderRow(row, index)}</TableCell>
                            );
                          }
                          const value = row[id] as { toString?: () => string };
                          if (typeof value?.['toString'] !== 'function') {
                            return (
                              <TableCell sx={sx} key={id} align={column.align || 'left'}>
                                <Typography variant="body2" sx={{ color: theme.palette.error.main }}>Cannot render...</Typography>
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell sx={sx} key={id} align={column.align || 'left'}>{value.toString()}</TableCell>
                          );
                        })
                      }
                    </TableRow>
                  );
                })}
                { rows.length === 0 && (
                  <TableRow sx={{
                    height: 53 * 2,
                  }}>
                    <TableCell colSpan={Object.keys(columns).length} sx={{ textAlign: 'center' }}>
                      <Typography variant="overline"><strong>{ noDataText || 'Keine Daten gefunden' }</strong></Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          component="div"
          count={totalRowCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Einträge pro Seite"
          labelDisplayedRows={(info) => `${info.from}-${info.to} von ${info.count}`}
        />
      </Paper>
    </Box>
  );
};
