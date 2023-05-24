import { QueryMany } from '@directus/sdk';
import React from 'react';

import { findSongById, findSongs, findSonsByAuthorId } from '@/services';
import { type Author, type Song } from '@/types';

import { FetchingHook, useBaseFetchHook } from './utils';

export const useGetSongs = (options?: QueryMany<Song>, enabled = true): FetchingHook<Song[]> => {
  const fetcher = React.useCallback(() => findSongs(options), [options]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetSongById = (id: Song['id'], enabled = true): FetchingHook<Song | null | undefined> => {
  const fetcher = React.useCallback(() => findSongById(id), [id]);
  return useBaseFetchHook(fetcher, enabled);
};

export const useGetSongsByAuthorId = (authorId: Author['id'], options?: QueryMany<Song>, enabled = true): FetchingHook<Song[]> => {
  const fetcher = React.useCallback(() => findSonsByAuthorId(authorId, options), [authorId, options]);
  return useBaseFetchHook(fetcher, enabled);
};
