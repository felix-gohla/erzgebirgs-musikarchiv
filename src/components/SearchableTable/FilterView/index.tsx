import { List } from '@mui/material';
import React from 'react';

import {
  ColumnDefinition,
  columnDefinitionToArray,
  FilterModelFromColumnDefinition,
  FilterOption,
} from '../types';
import { BooleanFilterEntry } from './BooleanFilterEntry';
import { MultiSelectFilterEntry } from './MultiSelectFilterEntry';
import { TextFilterEntry } from './TextFilterEntry';

export interface FilterViewProps<C extends ColumnDefinition<T>, T> {
  columns: C;
  filterModel: FilterModelFromColumnDefinition<C, T>;
  onChange?: (filterModel: FilterModelFromColumnDefinition<C, T>) => void | PromiseLike<void>;
  debounceFilterChange?: number;
}

export { ResetFilterChips as FilterChips } from './ResetFilterChips';

export const FilterView = <C extends ColumnDefinition<T>, T>(props: FilterViewProps<C, T>) => {
  const {
    onChange,
    columns,
    filterModel,
  } = props;

  const filterableColumns = React.useMemo(
    () => {
      return columnDefinitionToArray(columns)
        .filter(([_, column]) => !!column.filterSettings)
        .sort(([_, column]) => column.filterSettings?.order || 0);
    },
    [columns],
  );

  const [isDropdownOpen, setIsDropdownOpen] = React.useState<Record<keyof C, boolean>>(() =>
    filterableColumns.filter(([_, column]) => column.filterSettings?.type === 'multi-select').reduce((acc, [id]) => {
      acc[id] = false;
      return acc;
    }, {} as Record<keyof C, boolean>),
  );

  const handleDropdownClick = (columnId: keyof C) => {
    const currentValue = isDropdownOpen[columnId] ?? false;
    setIsDropdownOpen({
      ...isDropdownOpen,
      [columnId]: !currentValue,
    });
  };

  /**
   * Callbacks for filter interaction.
   */
  const setFilterModelBoolean = React.useCallback(
    (columnId: keyof C, newValue: boolean) => {
      const newFilterModel = {
        ...filterModel,
        [columnId]: {
          ...(filterModel[columnId]),
          filterValue: newValue,
        },
      };
      onChange?.(newFilterModel);
    },
    [filterModel, onChange],
  );

  const setFilterModelMultiValue = React.useCallback(
    (columnId: keyof C, optionId: FilterOption['id'], newValue: boolean) => {
      const currentSet = filterModel[columnId]?.filterValue as Set<string | number> | undefined ?? new Set();
      if (newValue) {
        currentSet.add(optionId);
      } else {
        currentSet.delete(optionId);
      }
      const newFilterModel = {
        ...filterModel,
        [columnId]: {
          ...filterModel[columnId],
          filterValue: currentSet.size > 0 ? currentSet : undefined,
        },
      };
      onChange?.(newFilterModel);
    },
    [filterModel, onChange],
  );

  const setFilterModelText = React.useCallback(
    (columnId: keyof C, newValue: string) => {
      const newFilterModel = {
        ...filterModel,
        [columnId]: {
          ...filterModel[columnId],
          filterValue: newValue.length > 0 ? newValue : undefined,
        },
      };
      onChange?.(newFilterModel);
    },
    [filterModel, onChange],
  );

  if (filterableColumns.length < 1) {
    return null;
  }

  const spacingBetweenFilters = 1;


  return (
    <List
      sx={{ width: '100%' }}
    >
      {
        filterableColumns.map(([columnId, column]) => {
          const { filterSettings } = column;
          if (!filterSettings) {
            return null;
          }
          switch (filterSettings.type) {
          case 'boolean': {
            const isChecked = !!(filterModel[columnId]?.filterValue);
            return <BooleanFilterEntry
              spacing={spacingBetweenFilters}
              key={columnId}
              onChange={setFilterModelBoolean.bind(null, columnId)}
              filterSettings={filterSettings}
              isChecked={isChecked}
            />;
          }
          case 'text': {
            return <TextFilterEntry
              key={columnId}
              title={filterSettings.title}
              spacing={spacingBetweenFilters}
              filterValue={filterModel[columnId]?.filterValue as string}
              onChange={setFilterModelText.bind(null, columnId)}
              debounceInputDelay={250}
            />;
          }
          case 'multi-select': {
            const open = isDropdownOpen[columnId] ?? false;

            return <MultiSelectFilterEntry
              key={columnId}
              columnId={columnId}
              spacing={spacingBetweenFilters}
              open={open}
              onToggleOpen={() => handleDropdownClick(columnId)}
              filter={filterSettings}
              onChange={setFilterModelMultiValue.bind(null, columnId)}
              filterValue={filterModel[columnId]?.filterValue as Set<string | number> | undefined}
            />;
          }
          default:
            return null;
          }
        })
      }
    </List>
  );
};
