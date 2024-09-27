import { type Song } from './songs'

/**
 * An author.
 */
export interface Author {
    /**
     * A unique identifier for this author.
     */
    id: number;
    /**
     * The date, this author was created in the database.
     */
    date_created: string;
    /**
     * The date this author was lastly updated.
     */
    date_updated: string | null;
    /**
     * The author's last name.
     */
    name: string;
    /**
     * The author's first name.
     */
    first_name: string;
    /**
     * An optional ID for an image file.
     */
    image: string | null;
    /**
     * A description for this author.
     */
    description: string | null;

    /**
     * Related songs.
     */
    songs: number[] | Song[] | null;

    /**
     * The number of related songs.
     */
    songs_count: number;
}

export type AuthorOverview = Pick<Author, 'id' | 'name' | 'first_name' | 'songs_count'>
