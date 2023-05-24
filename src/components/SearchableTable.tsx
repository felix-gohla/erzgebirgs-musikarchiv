import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import React from 'react';

interface EnhancedTableToolbarProps {
  numSelected: number;
  title?: string,
  subtitle?: string,
}

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = (props: EnhancedTableToolbarProps)  =>{
  const { numSelected, title, subtitle } = props;

  return (
    <Toolbar
      sx={{
        py: subtitle ? 2 : undefined,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
        flexWrap: 'wrap',
      }}
    >
      <Box component="div" sx={{ width: '100%', display: 'flex', flexGrow: 1 }}>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="span"
          >
            {numSelected} ausgewählt
          </Typography>
        ) : title && (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            { title }
          </Typography>
        )}
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
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
    </Toolbar>
  );
};

type Order = 'asc' | 'desc';

type SortableColumn<T> = {
  /**
   * Whether the column is sortable. Default is `true`.
   */
  sortable: false
} | {
  /**
   * Whether the column is sortable. Default is `true`.
   */
  sortable: true,

  /**
   * A comparator necessary for comparing the values of this column.
   */
  comparator: (order: Order, lhs: T, rhs: T) => number,
}

type Column<T> = SortableColumn<T> & {
  /**
   * The column's key.
   */
  id: keyof T & string,

  /**
   * Whether to disable padding.
   */
  disablePadding?: boolean,

  /**
   * A label in the table header.
   */
  label: string,
  /**
   * An optional renderer for the cell content.
   */
  renderRow?: (o: T, idx: number) => React.ReactNode,

  /**
   * Optional alignment. Left-aligned is the default
   */
  align?: TableCellProps['align'],

  /**
   * A table column width.
   */
  width?: TableCellProps['width'],
}

interface EnhancedTableProps<T> {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T & string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: Column<T>[];
  enableSelection: boolean;
}

const EnhancedTableHead = <T,>(props: EnhancedTableProps<T>) => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    enableSelection,
  } = props;
  const createSortHandler =
    (property: keyof T & string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        { enableSelection && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            width={headCell.width}
          >
            { headCell.sortable
              ? (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id
                    ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'absteigend sortiert' : 'aufsteigend sortiert'}
                      </Box>
                    ) : null
                  }
                </TableSortLabel>
              )
              : ( headCell.label )
            }

          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

type TypeWithId = { id: string | number };

type SearchableTableProps<T extends TypeWithId> = {
  data: T[],
  columns: Column<T>[],
  defaultOrder: keyof T & string,
  tableTitle?: string,
  subtitle?: string,
} & ({
  enableSelection: false,
  onClick?: (row: T['id']) => void | Promise<void>,
} | {
  enableSelection: true,
  onSelect?: (rows: readonly T['id'][]) => void | Promise<void>,
})

export const SearchableTable = <T extends TypeWithId,>(props: SearchableTableProps<T>) => {
  const {
    data: rows,
    defaultOrder,
    columns,
    tableTitle,
    enableSelection = false,
    subtitle,
  } = props;

  const theme = useTheme();

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T & string>(defaultOrder);
  const [selected, setSelected] = React.useState<readonly T['id'][]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

  const handleClick = (_event: React.MouseEvent<unknown>, id: T['id']) => {
    if (!props.enableSelection) {
      props.onClick?.(id);
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () => {
      const column = columns.find((col) => col.id === orderBy);
      if (!column || !column.sortable) {
        throw new Error(`Cannot sort column "${orderBy}"`);
      }
      return rows
        .sort((lhs, rhs) => column.comparator(order, lhs, rhs))
        .slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        );
    },
    [rows, columns, order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar title={tableTitle} subtitle={subtitle} numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
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
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
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
                      columns.map((column) => {
                        if (column.renderRow) {
                          return (
                            <TableCell key={column.id} align={column.align || 'left'}>{column.renderRow(row, index)}</TableCell>
                          );
                        }
                        const value = row[column.id] as { toString?: () => string };
                        if (typeof value?.['toString'] !== 'function') {
                          return (
                            <TableCell key={column.id} align={column.align || 'left'}>
                              <Typography variant="body2" sx={{ color: theme.palette.error.main }}>Cannot render...</Typography>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align || 'left'}>{value.toString()}</TableCell>
                        );
                      })
                    }
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
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
