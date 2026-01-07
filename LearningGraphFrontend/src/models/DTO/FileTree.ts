export const NodeTypes = {
    File: "file",
    Folder: "folder",
} as const;

export type NodeType = typeof NodeTypes[keyof typeof NodeTypes];

export interface MarkdownMetaData {
    title: string;
    tags: string[];
    prerequisites: string[];
    related: string[];
}

export interface FileNode {
    name: string;
    type: string;
    metadata: MarkdownMetaData | null;
    children: FileNode[];
    path?: string
}

export interface MarkdownFileContent {
    fileName: string;
    content: string;
    metadata: MarkdownMetaData;
}

export interface AddNodeRequest {
    parentPath: string;
    name: string;
    type: string;
}

export interface DeleteNodeRequest {
    path: string;
    type: string;
}

export interface RenameNodeRequest {
    path: string;
    newName: string;
}

export interface SaveFileRequest {
    filename: string;
    content: string;
    metadata: MarkdownMetaData;
}