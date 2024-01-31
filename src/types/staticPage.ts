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
     * Whether the page should be shown on the website.
     */
    visible: boolean;
    /**
     * The content of the page.
     */
    content: ContentBlocks;
}

export type ContentBlocks = {
    /**
     * The time this content block list was created.
     */
    time?: number;
    /**
     * The version of the editor that created this content block list.
     * See https://github.com/codex-team/editor.js for further information.
     */
    version?: number;

    /**
     * The content.
     */
    blocks: ContentBlock[]
}

type BasicBlock = {
    id: string;
}

export type ParagraphBlock = BasicBlock & {
    type: 'paragraph';
    data: {
        text: string;
    };
    tunes: {
        alignment: {
            alignment: 'left' | 'center' | 'right';
        };
    };
}

export type HeadingBlock = Omit<ParagraphBlock, 'type'> & {
    type: 'header';
    data: {
        level: 1 | 2 | 3 | 4 | 5 | 6;
    };
}

export type QuoteBlock = Omit<ParagraphBlock, 'type'> & {
    type: 'quote';
    data: {
        caption: string;
        alignment: 'left' | 'center' | 'right';
    };
}

export type NestedListContent = {
    content: string;
    items: NestedListContent[];
}

export type NestedListBlock = BasicBlock & {
    type: 'nestedlist';
    data: {
        style: 'unordered' | 'ordered';
        items: NestedListContent[];
    };
}

export type CodeBlock = BasicBlock & {
    type: 'code';
    data: {
        code: string;
    }
}

export type ImageBlock = BasicBlock & {
    type: 'image';
    data: {
        caption: string | null;
        file: {
            extentsion: string;
            fileURL: string;
            height: number;
            name: string;
            size: string;
            title: string;
            url: string;
            width: number;
            fileId: string;
        };
        withBorder?: boolean;
        stretched?: boolean;
        withBackground?: boolean;
    };
}

export type ChecklistBlock = BasicBlock & {
    type: 'checklist';
    data: {
        items: {
            text: string;
            checked: boolean;
        }[];
    };
}

export type DelimiterBlock = BasicBlock & {
    type: 'delimiter';
    data: unknown,
}

export type RawHtmlBlock = BasicBlock & {
    type: 'raw';
    data: {
        html: string;
    }
}

export type ContentBlock =
    | ParagraphBlock
    | HeadingBlock
    | QuoteBlock
    | NestedListBlock
    | CodeBlock
    | ImageBlock
    | ChecklistBlock
    | RawHtmlBlock
    | DelimiterBlock;
