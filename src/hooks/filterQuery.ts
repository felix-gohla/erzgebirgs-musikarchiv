import deepEqual from 'deep-equal';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { type Column, type ColumnDefinition } from '@/components/SearchableTable';
import {BooleanFilter, type FilterableColumns, FilterModelFromColumnDefinition,MultiSelectFilter, TextFilter } from '@/components/SearchableTable/types';

export type FilterUrlHookReturn<T, CD extends ColumnDefinition<T>, CF extends FilterableColumns<T, CD>> = {
  [K in keyof CF]: CF[K] extends BooleanFilter
    ? boolean | null
    : CF[K] extends MultiSelectFilter
      ? (string | number)[] | null
      : CF[K] extends TextFilter
        ? string | null
        : never
}


export const useFiltersFromUrl = <T, CD extends ColumnDefinition<T>>(columns: CD) => {
  const filterSettings: FilterableColumns<T, CD> = React.useMemo(() => {
    const retVal = {} as FilterableColumns<T, CD>;
    for (const [columnName, spec] of Object.entries(columns) as [keyof T & string, Column<T>][]) {
      const columnFilterSettings = spec.filterSettings;
      if (columnFilterSettings  ) {
        Object.assign(retVal, { [columnName]: columnFilterSettings   });
      }
    }
    return retVal;
  }, [columns]);

  const [searchParameters, setSearchParameters] = useSearchParams();

  const parsedFilter = React.useMemo(() => {
    try {
      return JSON.parse(searchParameters.get('filter') || '');
    } catch {
      return null;
    }
  }, [searchParameters]);

  const previousFiltersInUrl = React.useRef<FilterUrlHookReturn<T, CD, typeof filterSettings> | null>(null);

  const filtersInUrl = React.useMemo(() => {
    const keys = Object.keys(filterSettings) as (keyof typeof filterSettings)[];

    const newFilters = keys.reduce((acc, key) => {
      const columnFilterSettings = filterSettings[key];
      switch (columnFilterSettings.type) {
      case 'boolean':
      {
        const boolValue = parsedFilter ? parsedFilter[key] : null;
        if (typeof boolValue !== 'boolean') {
          acc[key] = null;
        } else  {
          acc[key] = boolValue;
        }
        return acc;
      }
      case 'text':
      {
        const stringValue = parsedFilter ? parsedFilter[key] : null;
        if (typeof stringValue !== 'string') {
          acc[key] = null;
        } else {
          acc[key] = stringValue;
        }
        return acc;
      }
      case 'multi-select': {
        const arrayValue = parsedFilter ? parsedFilter[key] : null;
        if (!Array.isArray(arrayValue)) {
          acc[key] = null;
        } else {
          const filteredTerms = new Set(arrayValue);
          acc[key] = filteredTerms.size > 0 ? filteredTerms : null;
        }
        return acc;
      }
      default:
        return acc;
      }
    }, {} as Record<string, unknown>) as FilterUrlHookReturn<T, CD, typeof filterSettings>;

    if (previousFiltersInUrl.current && deepEqual(previousFiltersInUrl.current, newFilters)) {
      return previousFiltersInUrl.current;
    }
    previousFiltersInUrl.current = newFilters;
    return newFilters;
  }, [filterSettings, parsedFilter]);

  const setFiltersInUrl = (newModel: FilterModelFromColumnDefinition<CD, T>) => {
    setSearchParameters((params) => {
      const filterObj: Record<string, unknown> = {};
      for (const columnName of Object.keys(newModel) as (keyof typeof newModel & string)[]) {
        const column = newModel[columnName];
        if (column) {
          const newValue = column.filterValue;
          if (!newValue) {
            params.delete(columnName);
            continue;
          }
          const type = column.filterType;
          switch (type) {
          case 'boolean':
            if (typeof newValue !== 'boolean') {
              throw new Error('Invalid filter type passed. Expected boolean.');
            }
            filterObj[columnName] = newValue;
            break;
          case 'multi-select':
            if (!(newValue instanceof Set)) {
              throw new Error('Invalid filter type passed. Expected set.');
            }
            if (newValue.size < 1) {
              continue;
            }
            filterObj[columnName] = Array.from(newValue);
            break;
          case 'text':
            if (typeof newValue !== 'string') {
              throw new Error('Invalid filter type passed. Expected string.');
            }
            if (newValue.length < 1) {
              continue;
            }
            filterObj[columnName] = newValue;
          }
        }
      }

      params.set('filter', JSON.stringify(filterObj));

      return params;
    });


    /*const type = filterSettings[name].type;
    if (!newValue) {
      setSearchParameters((params) => {
        params.delete(name);
        return params;
      });
      return;
    }
    switch (type) {
    case 'boolean':
      if (typeof newValue !== 'boolean') {
        throw new Error('Invalid filter type passed. Expected boolean.');
      }
      setSearchParameters({ [name]: `${newValue}` });
      break;
    case 'multi-select':
      if (!Array.isArray(newValue)) {
        throw new Error('Invalid filter type passed. Expected array.');
      }
      if (newValue.length < 1) {
        setSearchParameters((params) => {
          params.delete(name);
          return params;
        });
      } else {
        setSearchParameters((params) => {
          params.delete(name);
          newValue.map((val) => val.toString()).forEach((value) => params.append(name, value));
          return params;
        });
      }
      break;
    case 'text':
      if (typeof newValue !== 'string') {
        throw new Error('Invalid filter type passed. Expected string.');
      }
      setSearchParameters((params) => {
        params.set(name, newValue);
        return params;
      });
    }*/
  };

  return {
    previousFiltersInUrl: previousFiltersInUrl.current,
    filtersInUrl,
    setFiltersInUrl,
  };
};
