import React from 'react';

import { findAuthorById, findAuthors, type DbQueryOptions } from '@/services';
import { type Author, type AuthorOverview } from '@/types';

import { useDeepCompareMemoize } from '.';
import { FetchingHook, useBaseFetchHook } from './utils';


export const useGetAuthors = (options?: DbQueryOptions<Author>, enabled = true): FetchingHook<Author[]> => {
  const memoizedOptions = useDeepCompareMemoize(options);
  const fetcher = React.useCallback(() => findAuthors(memoizedOptions), [memoizedOptions]);
  return useBaseFetchHook(fetcher, enabled);
};

const overviewQuery: DbQueryOptions<Author> = {
  fields: ['id', 'name', 'first_name', 'count(songs)' ] as const 
};
export const useGetAuthorsOverview = (enabled = true): FetchingHook<AuthorOverview[]> => {
  const fetcher = React.useCallback(() => findAuthors(overviewQuery), [overviewQuery]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetAuthorById = (id: Author['id'], enabled = true): FetchingHook<Author | null | undefined> => {
  const fetcher = React.useCallback(() => findAuthorById(id), [id]);
  return useBaseFetchHook(fetcher, enabled);
};
