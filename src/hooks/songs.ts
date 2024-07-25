import React from 'react';

import { countSongs,findSongById, findSongs, findSongsByAuthorId, findSongsByGenreId } from '@/services';
import { type DbQueryFilter, type DbQueryOptions } from '@/services/directus';
import { type Author, type Genre, type Song } from '@/types';

import { useDeepCompareMemoize } from './deepCompareMemoize';
import { FetchingHook, useBaseFetchHook } from './utils';

export const useGetSongs = (options?: DbQueryOptions<Song>, enabled = true) => {
  const memoizedOptions = useDeepCompareMemoize(options);
  return useBaseFetchHook(findSongs, memoizedOptions, enabled);
};

export const useGetSongById = (id: Song['id'], enabled = true): FetchingHook<Song | null | undefined> => {
  const fetcher = React.useCallback(() => findSongById(id), [id]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetSongsByAuthorId = (authorId: Author['id'], options?: DbQueryOptions<Song>, enabled = true) => {
  const memoizedOptions = useDeepCompareMemoize(options);
  const fetcher = React.useCallback((options?: DbQueryOptions<Song>) => findSongsByAuthorId(authorId, options), [authorId]);
  return useBaseFetchHook(fetcher, memoizedOptions, enabled);
};

export const useGetSongsByGenreId = (genreId: Genre['id'], options?: DbQueryOptions<Song>, enabled = true) => {
  const memoizedOptions = useDeepCompareMemoize(options);
  const fetcher = React.useCallback((options?: DbQueryOptions<Song>) => findSongsByGenreId(genreId, options), [genreId]);
  return useBaseFetchHook(fetcher, memoizedOptions, enabled);
};

export const useCountSongs = (filter?: DbQueryFilter<Song>, enabled = true) => {
  const memoizedFilter = useDeepCompareMemoize(filter);
  const fetcher = React.useCallback((filter?: DbQueryFilter<Song>) => countSongs(filter), []);
  return useBaseFetchHook(fetcher, memoizedFilter, enabled);
};
