import { Button, Chip, Stack, StackProps } from '@mui/material';
import React from 'react';

import { BooleanFilter, ColumnDefinition, ConditionalFilter, FilterModelFromColumnDefinition, MultiSelectFilter, TextFilter } from '../types';

type ResetFilterChipsProps<F extends FilterModelFromColumnDefinition<CD, T>, CD extends ColumnDefinition<T>, T> = {
  stackProps?: StackProps;
  showClearAllButton?: boolean;
  clearAllButtonText?: string;
} & ConditionalFilter<F, CD, T>

export const ResetFilterChips = <F extends FilterModelFromColumnDefinition<CD, T>, CD extends ColumnDefinition<T>, T>(props: ResetFilterChipsProps<F, CD, T>) => {
  const {
    stackProps,
    columns,
    filter,
    onFilterChange,
    showClearAllButton,
    clearAllButtonText,
  } = props;

  const filteredColumnTitles = React.useMemo(() => {
    if (!columns || !filter) {
      return null;
    }
    const returnValue: [keyof CD, string][] = [];
    for (const columnName of Object.keys(columns) as (keyof CD)[]) {
      const filterSettings = columns[columnName]?.filterSettings;
      if (!filterSettings) {
        continue;
      }
      const columnFilter = filter[columnName];
      if (columnFilter && columnFilter.filterValue) {
        switch (columnFilter.filterType) {
        case 'boolean':
          returnValue.push([columnName, (filterSettings as BooleanFilter).toggleTitle]);
          break;
        case 'text':
          returnValue.push([columnName, (filterSettings as TextFilter).title]);
          break;
        case 'multi-select':
          returnValue.push([columnName, (filterSettings as MultiSelectFilter).dropdownTitle]);
          break;
        default:
          throw new Error('Unknown filter type for TableToolbar.');
        }
      }
    }
    return returnValue.sort(([, titleA], [, titleB]) => titleA.localeCompare(titleB));
  }, [filter, columns]);

  const resetFilterCallback = React.useCallback((columnId: keyof CD) => {
    if (!onFilterChange || !filter) {
      return;
    }
    const newFilterModel = {
      ...filter,
      [columnId]: {
        ...filter[columnId],
        filterValue: undefined,
      },
    };
    onFilterChange(newFilterModel);
  }, [filter, onFilterChange]);

  const resetAllFilterCallback = React.useCallback(() => {
    if (!onFilterChange || !filter) {
      return;
    }
    const newFilterModel = { ...filter };
    for (const key of Object.keys(newFilterModel) as (keyof CD)[]) {
      newFilterModel[key] = { ...filter[key] };
      delete newFilterModel[key]?.filterValue;
    }
    onFilterChange(newFilterModel);
  }, [filter, onFilterChange]);

  if (!filteredColumnTitles || filteredColumnTitles.length === 0) {
    return null;
  }
  return (
    <Stack direction="row" gap={1} { ...stackProps }>
      { filteredColumnTitles.map(([columnId, title]) =>
        <Chip
          key={`filter-chip-${String(columnId)}`}
          label={title}
          onDelete={() => resetFilterCallback(columnId)}
        />,
      )}
      { showClearAllButton && filteredColumnTitles.length > 0 && <Button onClick={resetAllFilterCallback} variant="text">{clearAllButtonText || 'Filter löschen'}</Button> }
    </Stack>
  );
};
