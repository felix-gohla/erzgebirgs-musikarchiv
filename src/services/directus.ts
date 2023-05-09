import { FileItem, QueryMany } from '@directus/sdk';
import { Directus } from '@directus/sdk';

import { Author, Genre, Song } from '@/types';

type MusikDbCms = {
  songs: Song;
  authors: Author;
  genres: Genre;
}

export const DIRECTUS_BASE_URL = import.meta.env.VITE_CMS_API_URL;

/**
 * The main API instance.
 */
const directus = new Directus<MusikDbCms>(DIRECTUS_BASE_URL);

export const findSongs = async (options?: QueryMany<Song>): Promise<Song[]> => {
  const songs = await directus.items('songs').readByQuery({
    ...options,
    sort: ['title'],
    fields: ['*', 'authors.authors_id.*' as 'authors', 'genres.genre_id.*' as 'genres', 'audio'],
  });
  return songs.data || [];
};

export const findSongById = async (id: Song['id']): Promise<Song | null | undefined> => directus.items('songs')
  .readOne(
    id,
    {
      fields: ['*', 'authors.authors_id.*' as 'authors', 'genres.genres_id.*' as 'genres', 'audio'],
    },
  );


export const findAuthors = async (options?: QueryMany<Author>): Promise<Author[]> => {
  const authors = await directus.items('authors').readByQuery({
    sort: ['name'],
    ...options,
  });
  return authors.data || [];
};

export const findGenres = async (options?: QueryMany<Genre>): Promise<Genre[]> => {
  const genres = await directus.items('genres').readByQuery({
    sort: ['name'],
    ...options,
  });
  return genres.data || [];
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
