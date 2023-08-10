import { TableCellProps } from '@mui/material';

export type TypeWithId = { id: string | number };
export type Order = 'asc' | 'desc';

export type SortableColumn<T> = {
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

export type FilterOption = {
  id: string | number,
  label: string,
}

export type MultiSelectFilter = {
  type: 'multi-select',
  dropdownTitle: string,
  options: FilterOption[] | (() => (FilterOption[] | Promise<FilterOption[]>)),
}

export type TextFilter = {
  type: 'text',
  title: string,
}

export type BooleanFilter = {
  type: 'boolean',
  toggleTitle: string,
}

export type Filter = (MultiSelectFilter | TextFilter | BooleanFilter) & {
  order: number,
}

export type Column<T> = SortableColumn<T> & {
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
   * A table column minimum width.
   */
  minWidth?: string | number,

  /**
   * A table column maximum width.
   */
  maxWidth?: string | number,

  /**
   * Options for filtering this column.
   * If not set, the column is not filterable.
   */
  filterSettings?: Filter,
}

export type ColumnDefinition<T> = Partial<Record<keyof T & string, Column<T>>>;

export const columnDefinitionToArray = <T>(definition: ColumnDefinition<T>): [keyof T & string, Column<T>][] =>
  Object.entries(definition) as [keyof T & string, Column<T>][];

export type FilterValue<T extends Filter['type']> = T extends unknown
  ? T extends 'boolean'
    ? boolean
    : T extends 'multi-select'
      ? Set<string | number>
      : T extends 'text'
        ? string
        : never
  : never;

export type FilterModelFromColumn<
  CD extends ColumnDefinition<T>,
  T,
  C extends keyof CD,
> = CD extends unknown
    ? { [K in keyof CD]:
        CD[K] extends Column<T>
          ? CD[K]['filterSettings'] extends Filter
            ? {
              columnId: K,
              filterType: CD[K]['filterSettings']['type'],
              filterValue?: FilterValue<CD[K]['filterSettings']['type']>,
            }
            : never
          : never
    }[C]
 : never;

export type FilterModelFromColumnDefinition<
  CD extends ColumnDefinition<T>,
  T,
> = { [K in keyof CD]?: FilterModelFromColumn<CD, T, K> };

export type ConditionalFilter<F extends FilterModelFromColumnDefinition<C, T>, C extends ColumnDefinition<T>, T> =
  {
    filter: F | undefined;
    columns: C;
    onFilterChange?: (filterModel: FilterModelFromColumnDefinition<C, T>) => void | PromiseLike<void>;
  }
  | {
    filter?: never;
    columns?: never;
    onFilterChange?: never;
  }

export type DistributivePick<T, K extends keyof T> = T extends unknown
  ? Pick<T, K>
  : never;
