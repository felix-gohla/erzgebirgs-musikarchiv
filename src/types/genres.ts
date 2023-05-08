/**
 * A genre.
 */
export interface Genre {
    /**
     * A unique identifier for this genre.
     */
    id: string;
    /**
     * The date, this genre was created in the database.
     */
    dateCreated: Date;
    /**
     * The date this genre was lastly updated.
     */
    dateUpdated: Date;
    /**
     * The genre's name.
     */
    name: string;
}
