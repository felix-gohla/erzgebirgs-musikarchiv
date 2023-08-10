import {
  Box,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React from 'react';

import { ColumnDefinition, columnDefinitionToArray,Order } from './types';

interface SortableTableHeadProps<C extends ColumnDefinition<T>, T> {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T & string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: C;
  enableSelection: boolean;
}

export const SortableTableHead = <C extends ColumnDefinition<T>, T>(props: SortableTableHeadProps<C, T>) => {
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
        {enableSelection && (
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
        { columnDefinitionToArray(headCells).map(([columnId, headCell]) => (
          <TableCell
            key={columnId}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === columnId ? order : false}
            sx={{ minWidth: headCell.minWidth, maxWidth: headCell.maxWidth }}
          >
            {headCell.sortable
              ? (
                <TableSortLabel
                  active={orderBy === columnId}
                  direction={orderBy === columnId ? order : 'asc'}
                  onClick={createSortHandler(columnId)}
                >
                  {headCell.label}
                  {orderBy === columnId
                    ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'absteigend sortiert' : 'aufsteigend sortiert'}
                      </Box>
                    ) : null
                  }
                </TableSortLabel>
              )
              : (headCell.label)
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
