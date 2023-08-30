import { QueryMany } from '@directus/sdk';
import React from 'react';

import { countSongs,findSongById, findSongs, findSongsByAuthorId, findSongsByGenreId } from '@/services';
import { type Author, Genre, type Song } from '@/types';

import { useDeepCompareMemoize } from './deepCompareMemoize';
import { FetchingHook, useBaseFetchHook } from './utils';

export const useGetSongs = (options?: QueryMany<Song>, enabled = true) => {
  const memoizedOptions = useDeepCompareMemoize(options);
  return useBaseFetchHook(findSongs, memoizedOptions, enabled);
};

export const useGetSongById = (id: Song['id'], enabled = true): FetchingHook<Song | null | undefined> => {
  const fetcher = React.useCallback(() => findSongById(id), [id]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetSongsByAuthorId = (authorId: Author['id'], options?: QueryMany<Song>, enabled = true) => {
  const memoizedOptions = useDeepCompareMemoize(options);
  const fetcher = React.useCallback((options?: QueryMany<Song>) => findSongsByAuthorId(authorId, options), [authorId]);
  return useBaseFetchHook(fetcher, memoizedOptions, enabled);
};

export const useGetSongsByGenreId = (genreId: Genre['id'], options?: QueryMany<Song>, enabled = true) => {
  const memoizedOptions = useDeepCompareMemoize(options);
  const fetcher = React.useCallback((options?: QueryMany<Song>) => findSongsByGenreId(genreId, options), [genreId]);
  return useBaseFetchHook(fetcher, memoizedOptions, enabled);
};

export const useCountSongs = (filter?: QueryMany<Song>['filter'], enabled = true) => {
  const memoizedFilter = useDeepCompareMemoize(filter);
  const fetcher = React.useCallback((filter: QueryMany<Song>['filter']) => countSongs(filter), []);
  return useBaseFetchHook(fetcher, memoizedFilter, enabled);
};
