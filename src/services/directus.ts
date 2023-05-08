import { Author, Genre, Song } from '@/types';
import { QueryMany } from '@directus/sdk';
import { Directus } from '@directus/sdk';

type MusikDbCms = {
  songs: Song;
  authors: Author;
  genres: Genre;
}

// The main API instance.
const directus = new Directus<MusikDbCms>(import.meta.env.VITE_CMS_API_URL);

export const findSongs = async (options?: QueryMany<Song>): Promise<Song[]> => {
  const songs = await directus.items('songs').readByQuery({
    sort: ['title'],
    ...options,
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

export const findGenres = async (options?: QueryMany<Genre>): Promise<Genre[]> => {
  const genres = await directus.items('genres').readByQuery({
    sort: ['name'],
    ...options,
  });
  return genres.data || [];
};
