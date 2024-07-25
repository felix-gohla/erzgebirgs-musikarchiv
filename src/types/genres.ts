import { Song } from "./songs";

/**
 * A genre.
 */
export interface Genre {
    /**
     * A unique identifier for this genre.
     */
    id: number;
    /**
     * The date, this genre was created in the database.
     */
    date_created: string;
    /**
     * The date this genre was lastly updated.
     */
    date_updated: string | null;
    /**
     * The genre's name.
     */
    name: string;
    /**
     * The number of songs for this genre (sadly, directus only returns this as a string).
     */
    songs_count: number;
    /**
     * The songs that are assigned to this genre.
     */
    songs: Song[] | null;
}
