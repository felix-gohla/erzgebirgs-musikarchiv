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
     * The number of songs for this genre.
     */
    songs_count: number;
}
