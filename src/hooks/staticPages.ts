import React from 'react';

import { findStaticPageById, findStaticPages, type DbQueryFilter } from '@/services';
import { StaticPage } from '@/types';

import { useDeepCompareMemoize } from './deepCompareMemoize';
import { FetchingHook, useBaseFetchHook } from './utils';

export const useGetStaticPages = (options?: DbQueryFilter<StaticPage>, enabled = true): FetchingHook<Pick<StaticPage, 'id' | 'title'>[]> => {
  const memoizedOptions = useDeepCompareMemoize(options);
  const fetcher = React.useCallback(() => findStaticPages(memoizedOptions), [memoizedOptions]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetStaticPageById = (id: StaticPage['id'], enabled = true): FetchingHook<StaticPage | null | undefined> => {
  const fetcher = React.useCallback(() => findStaticPageById(id), [id]);
  return useBaseFetchHook(fetcher, enabled);
};