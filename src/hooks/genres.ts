import { QueryMany } from '@directus/sdk';
import React from 'react';

import { findGenreById, findGenres } from '@/services';
import { Genre } from '@/types';

import { FetchingHook, useBaseFetchHook } from './utils';

export const useGetGenres = (options?: QueryMany<Genre>, enabled = true): FetchingHook<Genre[]> => {
  const fetcher = React.useCallback(() => findGenres(options), [options]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetGenreById = (id: Genre['id'], enabled = true): FetchingHook<Genre | null | undefined> => {
  const fetcher = React.useCallback(() => findGenreById(id), [id]);
  return useBaseFetchHook(fetcher, enabled);
};
