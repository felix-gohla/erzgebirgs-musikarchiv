/**
 * A static page.
 */
export interface StaticPage {
    /**
     * A unique identifier for this page.
     */
    id: number;
    /**
     * The date, this page was created in the database.
     */
    date_created: string;
    /**
     * The date this page was lastly updated.
     */
    date_updated: string | null;
    /**
     * The page's name.
     */
    title: string;
    /**
     * The content as HTML.
     */
    content: string;
    /**
     * Whether the page should be shown on the website.
     */
    visible: boolean;
}
