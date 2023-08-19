import { QueryMany } from '@directus/sdk';
import React from 'react';

import { countGenres, findGenreById, findGenres } from '@/services';
import { Genre } from '@/types';

import { useDeepCompareMemoize } from './deepCompareMemoize';
import { FetchingHook, useBaseFetchHook } from './utils';

export const useGetGenres = (options?: QueryMany<Genre>, enabled = true): FetchingHook<Genre[]> => {
  const memoizedOptions = useDeepCompareMemoize(options);
  const fetcher = React.useCallback(() => findGenres(memoizedOptions), [memoizedOptions]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetGenreById = (id: Genre['id'], enabled = true): FetchingHook<Genre | null | undefined> => {
  const fetcher = React.useCallback(() => findGenreById(id), [id]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useCountGenres = (filter: QueryMany<Genre>['filter'] = undefined, enabled = true) => {
  const memoizedFilter = useDeepCompareMemoize(filter);
  const fetcher = React.useCallback(() => countGenres(memoizedFilter), [memoizedFilter]);
  return useBaseFetchHook(fetcher, enabled);
};
