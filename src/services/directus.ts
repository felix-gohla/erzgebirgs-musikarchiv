import { aggregate, createDirectus,Query, readFile, readItem, readItems, rest } from '@directus/sdk';

import { Author, Genre, Song, SongsAuthors, SongsGenres, StaticPage } from '@/types';

type MusikDbCms = {
  songs: Song[];
  authors: Author[];
  genres: Genre[];
  static_pages: StaticPage[];
  songs_authors: SongsAuthors[];
  songs_genres: SongsGenres[];
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
const directus = createDirectus<MusikDbCms>(DIRECTUS_BASE_URL).with(rest());

const SONG_FIELDS = [
  '*',
  'authors.authors_id.*' as 'authors',
  'count(authors)',
  'genres.genres_id.*' as 'genres',
  'count(genres)',
  'audio',
] satisfies Query<MusikDbCms, Song>['fields'];

export const findSongs = async (options?: Query<MusikDbCms, Song>): Promise<Song[]> => {
  return directus.request(
    readItems(
      'songs', {
        ...options,
        sort: options?.sort ?? ['title' as const],
        fields: SONG_FIELDS,
      },
    ),
  );
};

export const countSongs = async (filter: Query<MusikDbCms, Song>['filter']): Promise<number> => {
  const response = await directus.request(
    aggregate(
      'songs',
      {
        aggregate: {
          count: ['id'],
        },
        query: {
          filter: filter ?? {},
        },
      },
    ));
  return parseInt(response[0].count.id ?? 'NaN');
};

export const findSongById = async (id: Song['id']): Promise<Song | null | undefined> => directus.request(readItem('songs', id, { fields: SONG_FIELDS }));

export const findSongsByAuthorId = async (authorId: Author['id'], options?: Query<MusikDbCms, Song>): Promise<Song[]> =>  await directus.request(
  readItems(
    'songs',
    {
      ...options,
      sort: ['title'],
      fields: SONG_FIELDS,
      filter: {
        ...options?.filter,
        authors: {
          ...options?.filter?.authors,
          authors_id: {
            id: {
              _eq: authorId,
            },
          },
        },
      },
    }),
);

export const findSongsByGenreId = async (genreId: Genre['id'], options?: Query<MusikDbCms, Song>): Promise<Song[]> => directus.request(
  readItems(
    'songs',
    {
      ...options,
      sort: ['title'],
      fields: SONG_FIELDS,
      filter: {
        ...options?.filter,
        genres: {
          ...options?.filter?.genres,
          genres_id: {
            id: {
              _eq: genreId,
            },
          },
        },
      },
    },
  ),
);

const AUTHORS_FIELDS = ['*', 'count(songs)'] satisfies Query<MusikDbCms, Author>['fields'];

export const findAuthors = async (options?: Query<MusikDbCms, Author>): Promise<Author[]> => directus.request(
  readItems(
    'authors',{
      fields: AUTHORS_FIELDS,
      sort: ['name', 'first_name'],
      ...options,
    },
  ),
);

export const findAuthorById = async (id: Author['id']): Promise<Author | null | undefined> => directus.request(
  readItem(
    'authors',
    id,
    {
      fields: AUTHORS_FIELDS,
    },
  ),
);

const GENRES_FIELDS = ['*', 'count(songs)'] satisfies Query<MusikDbCms, Genre>['fields'];

export const findGenres = async (options?: Query<MusikDbCms, Genre>): Promise<Genre[]> => directus.request(
  readItems(
    'genres', {
      fields: GENRES_FIELDS,
      sort: ['name'],
      ...options,
    },
  ),
);

export const findGenreById = async (id: Genre['id']): Promise<Genre | null | undefined> => directus.request(
  readItem(
    'genres',
    id,
    {
      fields: GENRES_FIELDS,
    },
  ),
);

export const countGenres = async (filter: Query<MusikDbCms, Genre>['filter']): Promise<number> => {
  const response = await directus.request(
    aggregate(
      'genres',
      {
        aggregate: {
          count: ['id'],
        },
        query: {
          filter: filter ?? {},
        },
      },
    ));
  return parseInt(response[0].count.id ?? 'NaN');
};

export type File = {
  id: string,
  description: string | null,
  filesize: number | null,
  title: string | null,
  location: string | null,
  filenameDownload: string,
};

export const getFile = async (fileId: string): Promise<File | null> => {
  const file = await directus.request(readFile(fileId));
  if (!file) {
    return null;
  }
  return {
    id: file.id,
    description: file.description,
    filesize: parseInt(file.filesize || 'NaN'),
    filenameDownload: file.filename_download,
    title: file.title,
    location: file.location,
  };
};

export type Image = {
  id: string,
  description: string | null,
  filesize: number | null,
  title: string | null,
  location: string | null,
  filenameDownload: string,
  height: number,
  width: number,
};


export const getImage = async (fileId: string): Promise<Image | null> => {
  const file = await directus.request(readFile(fileId));
  if (!file) {
    return null;
  }
  return {
    id: file.id,
    description: file.description,
    filesize: parseInt(file.filesize || 'NaN'),
    filenameDownload: file.filename_download,
    title: file.title,
    height: file.height ?? 0,
    width: file.width ?? 0,
    location: file.location,
  };
};

export const findStaticPages = async (filter?: Query<MusikDbCms, StaticPage>['filter']): Promise<Pick<StaticPage, 'id' | 'title' | 'visible'>[]> => {
  const staticPages = await directus.request(
    readItems(
      'static_pages',
      {
        fields: ['id', 'title', 'visible'],
        filter: filter ?? {},
      },
    ),
  );
  return staticPages.map((sp) => ({
    id: sp.id,
    title: sp.title,
    visible: sp.visible,
  }));
};

export const findStaticPageById = async (id: StaticPage['id']): Promise<StaticPage | null | undefined> => directus.request(
  readItem(
    'static_pages',
    id,
    {
      fields: ['id', 'title', 'date_created', 'date_updated', 'content', 'visible'],
    },
  ),
);

export type QueryOptions<T> = Query<MusikDbCms, T>
export type QueryFilter<T> = QueryOptions<T>['filter']
