import { Directus, FileItem, FilterOperators, QueryMany } from '@directus/sdk';

import { Author, AuthorRelation, Genre, GenreRelation, Song } from '@/types';

type MusikDbCms = {
  songs: Song;
  authors: Author;
  genres: Genre;
}

export const DIRECTUS_BASE_URL = import.meta.env.VITE_CMS_API_URL;

export const assetUrlFromFileId = (fileId: string, options?: { download?: boolean, downloadFilename?: string, width?: number, height?: number, quality?: number }) => {
  const { download = false, downloadFilename, width, height, quality } = options || {};
  const url = new URL(`/assets/${fileId}`, DIRECTUS_BASE_URL);
  if (download) {
    url.searchParams.set('download', 'true');
  }
  url.searchParams.set('withoutEnlargement', 'true');
  url.searchParams.set('format', 'auto');
  if (width) {
    url.searchParams.set('width', width.toString());
  }
  if (height) {
    url.searchParams.set('height', height.toString());
  }
  if (quality) {
    url.searchParams.set('quality', quality.toString());
  }
  if (downloadFilename) {
    url.pathname += `/${downloadFilename}`;
  }
  return url;
};

/**
 * The main API instance.
 */
const directus = new Directus<MusikDbCms>(DIRECTUS_BASE_URL);

const SONG_FIELDS = ['*', 'authors.authors_id.*' as 'authors', 'genres.genres_id.*' as 'genres', 'audio'] as QueryMany<Song>['fields'];

export const findSongs = async (options?: QueryMany<Song>): Promise<Song[]> => {
  const songs = await directus.items('songs').readByQuery({
    ...options,
    sort: ['title'],
    fields: SONG_FIELDS,
  });
  return songs.data || [];
};

export const findSongById = async (id: Song['id']): Promise<Song | null | undefined> => directus.items('songs')
  .readOne(
    id,
    {
      fields: SONG_FIELDS,
    },
  );

export const findSongsByAuthorId = async (authorId: Author['id'], options?: QueryMany<Song>): Promise<Song[]> => {
  const songs = await directus.items('songs')
    .readByQuery({
      ...options,
      sort: ['title'],
      fields: SONG_FIELDS,
      filter: { authors: { authors_id: authorId } as FilterOperators<AuthorRelation[]> },
    });
  return songs.data || [];
};

export const findSonsByGenreId = async (genreId: Genre['id'], options?: QueryMany<Song>): Promise<Song[]> => {
  const songs = await directus.items('songs')
    .readByQuery({
      ...options,
      sort: ['title'],
      fields: SONG_FIELDS,
      filter: { genres: { genres_id: genreId } as FilterOperators<GenreRelation[]> },
    });
  return songs.data || [];
};

export const findAuthors = async (options?: QueryMany<Author>): Promise<Author[]> => {
  const authors = await directus.items('authors').readByQuery({
    sort: ['name'],
    ...options,
  });
  return authors.data || [];
};

export const findAuthorById = async (id: Author['id']): Promise<Author | null | undefined> => directus.items('authors')
  .readOne(
    id,
    {
      fields: ['*'],
    },
  );

export const findGenres = async (options?: QueryMany<Genre>): Promise<Genre[]> => {
  const genres = await directus.items('genres').readByQuery({
    sort: ['name'],
    ...options,
  });
  return genres.data || [];
};

export const findGenreById = async (id: Genre['id']): Promise<Genre | null | undefined> => directus.items('genres')
  .readOne(
    id,
    {
      fields: ['*'],
    },
  );

export type File = Pick<FileItem, 'id' | 'description' | 'filesize' | 'title' | 'location'> & { filenameDownload: string };

export const getFile = async (fileId: string): Promise<File | null> => {
  const file = await directus.files.readOne(fileId);
  if (!file) {
    return null;
  }
  return {
    id: file.id,
    description: file.description,
    filesize: file.filesize,
    filenameDownload: file.filename_download,
    title: file.title,
    location: file.location,
  };
};


export type Image = Pick<FileItem, 'id' | 'description' | 'filesize' | 'title' | 'height' | 'width' | 'location'> & { filenameDownload: string };

export const getImage = async (fileId: string): Promise<Image | null> => {
  const file = await directus.files.readOne(fileId);
  if (!file) {
    return null;
  }
  return {
    id: file.id,
    description: file.description,
    filesize: file.filesize,
    filenameDownload: file.filename_download,
    title: file.title,
    height: file.height,
    width: file.width,
    location: file.location,
  };
};
