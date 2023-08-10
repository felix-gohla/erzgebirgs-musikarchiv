import { QueryMany } from '@directus/sdk';
import React from 'react';

import { countSongs,findSongById, findSongs, findSongsByAuthorId, findSongsByGenreId } from '@/services';
import { type Author, Genre, type Song } from '@/types';

import { useDeepCompareMemoize } from './deepCompareMemoize';
import { FetchingHook, useBaseFetchHook } from './utils';

export const useGetSongs = (options?: QueryMany<Song>, enabled = true): FetchingHook<Song[]> => {
  const memoizedOptions = useDeepCompareMemoize(options);
  const fetcher = React.useCallback(() => findSongs(memoizedOptions), [memoizedOptions]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetSongById = (id: Song['id'], enabled = true): FetchingHook<Song | null | undefined> => {
  const fetcher = React.useCallback(() => findSongById(id), [id]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetSongsByAuthorId = (authorId: Author['id'], options?: QueryMany<Song>, enabled = true): FetchingHook<Song[]> => {
  const memoizedOptions = useDeepCompareMemoize(options);
  const fetcher = React.useCallback(() => findSongsByAuthorId(authorId, memoizedOptions), [authorId, memoizedOptions]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetSongsByGenreId = (genreId: Genre['id'], options?: QueryMany<Song>, enabled = true): FetchingHook<Song[]> => {
  const memoizedOptions = useDeepCompareMemoize(options);
  const fetcher = React.useCallback(() => findSongsByGenreId(genreId, memoizedOptions), [genreId, memoizedOptions]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useCountSongs = (filter: QueryMany<Song>['filter'] = undefined, enabled = true) => {
  const memoizedFilter = useDeepCompareMemoize(filter);
  const fetcher = React.useCallback(() => countSongs(memoizedFilter), [memoizedFilter]);
  return useBaseFetchHook(fetcher, enabled);
};
