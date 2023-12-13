import { type Author } from './authors';
import { type Genre } from './genres';

/**
 * A song.
 */
export interface Song {
    /**
     * A unique identifier for this song.
     */
    id: number;
    /**
     * The date, this song was created.
     */
    date_created: string;
     /**
     * The date, this song was lastly updated.
     */
    date_updated: string | null;
    /**
     * A name for this song.
     */
    title: string;
    /**
     * Further description.
     */
    text: string;
    /**
     * The ID of the PDF.
     */
    pdf?: string;
    /**
     * The file ID of the preview.
     */
    preview_image?: string;
    /**
     * The file ID of the audio preview.
     */
    audio?: string;

    /**
     * The authors that are linked to this song.
     */
    authors: SongsAuthors[];

    /**
     * The genres that are linked to this song.
     */
    genres: SongsGenres[];
}

interface SongRelation {
    id: number;
    songs_id: Song
}

export interface SongsAuthors extends SongRelation {
    authors_id: Author,
}

export interface SongsGenres extends SongRelation {
    genres_id: Genre,
}
