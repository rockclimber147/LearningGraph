export type RawMarkdownMetaData = {
    title: string;
    tags: string[];
    prerequisites: string[];
    related: string[];
};

export class MarkdownMetaData {
    title: string;
    tags: string[];
    prerequisites: string[];
    related: string[];

    constructor(data: RawMarkdownMetaData) {
        this.title = data.title;
        this.tags = Array.isArray(data.tags) ? data.tags : [];
        this.prerequisites = Array.isArray(data.prerequisites) ? data.prerequisites : [];
        this.related = Array.isArray(data.related) ? data.related : [];
    }
}

export class DefaultMetaData extends MarkdownMetaData {
    constructor() {
        super({title: "title", tags: [], prerequisites: [], related: []})
    }
}

export class MarkdownFile {
    fileName: string;
    content: string;
    metaData: MarkdownMetaData;

    constructor(data: {
        fileName: string;
        content: string;
        metadata: RawMarkdownMetaData; 
    }) {
        this.fileName = data.fileName;
        this.content = data.content;
        this.metaData = new MarkdownMetaData(data.metadata);
    }
}