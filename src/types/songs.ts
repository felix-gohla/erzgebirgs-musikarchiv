import { Author } from './authors';
import { Genre } from './genres';

/**
 * A song.
 */
export interface Song {
    /**
     * A unique identifier for this song.
     */
    id: string;
    /**
     * The date, this song was created.
     */
    dateCreated: Date;
     /**
     * The date, this song was lastly updated.
     */
    dateUpdated: Date;
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
    previewImage?: string;
    /**
     * The file ID of the audio preview.
     */
    audio?: string;

    /**
     * The authors that are linked to this song.
     */
    authors: Author[];

    /**
     * The genres that are linked to this song.
     */
    genres: Genre[];
}
