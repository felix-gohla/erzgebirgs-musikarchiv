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
     * The author's full name.
     */
    name: string;
    /**
     * An optional ID for an image file.
     */
    image: string | null;
    /**
     * A description for this author.
     */
    description: string | null;
    /**
     * The number of songs associated with the author.
     */
    song_count: number;
}

export interface AuthorRelation {
    id: number,
    authors_id: Author,
}
