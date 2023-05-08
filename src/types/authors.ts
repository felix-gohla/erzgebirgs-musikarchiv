/**
 * An author.
 */
export interface Author {
    /**
     * A unique identifier for this author.
     */
    id: string;
    /**
     * The date, this author was created in the database.
     */
    dateCreated: Date;
    /**
     * The date this author was lastly updated.
     */
    dateUpdated: Date;
    /**
     * The author's full name.
     */
    name: string;
    /**
     * An optional ID for an image file.
     */
    image?: string;
}
