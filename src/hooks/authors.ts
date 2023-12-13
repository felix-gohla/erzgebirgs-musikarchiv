import React from 'react';

import { findAuthorById,findAuthors,QueryOptions } from '@/services';
import { Author } from '@/types';

import { useDeepCompareMemoize } from '.';
import { FetchingHook, useBaseFetchHook } from './utils';


export const useGetAuthors = (options?: QueryOptions<Author>, enabled = true): FetchingHook<Author[]> => {
  const memoizedOptions = useDeepCompareMemoize(options);
  const fetcher = React.useCallback(() => findAuthors(memoizedOptions), [memoizedOptions]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetAuthorById = (id: Author['id'], enabled = true): FetchingHook<Author | null | undefined> => {
  const fetcher = React.useCallback(() => findAuthorById(id), [id]);
  return useBaseFetchHook(fetcher, enabled);
};
