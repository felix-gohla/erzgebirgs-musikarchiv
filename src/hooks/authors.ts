import { QueryMany } from '@directus/sdk';
import React from 'react';

import { findAuthorById,findAuthors } from '@/services';
import { Author } from '@/types';

import { FetchingHook, useBaseFetchHook } from './utils';

export const useGetAuthors = (options?: QueryMany<Author>, enabled = true): FetchingHook<Author[]> => {
  const fetcher = React.useCallback(() => findAuthors(options), [options]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetAuthorById = (id: Author['id'], enabled = true): FetchingHook<Author | null | undefined> => {
  const fetcher = React.useCallback(() => findAuthorById(id), [id]);
  return useBaseFetchHook(fetcher, enabled);
};
