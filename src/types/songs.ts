import { AuthorRelation } from './authors';
import { GenreRelation } from './genres';

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
    authors: AuthorRelation[];

    /**
     * The genres that are linked to this song.
     */
    genres: GenreRelation[];
}
