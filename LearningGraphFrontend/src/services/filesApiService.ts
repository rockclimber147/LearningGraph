import { type FileNode } from "../components/FileTree/FileTree";
import { MarkdownFile, MarkdownMetaData } from "../models/markdown";

export class FilesApiService {
  private baseUrl: string;

  constructor(baseUrl = "http://localhost:5072/api/files") {
    this.baseUrl = baseUrl;
  }

  async fetchTree(): Promise<FileNode> {
    const res = await fetch(`${this.baseUrl}/tree`);
    if (!res.ok) throw new Error("Failed to fetch file tree");
    return res.json();
  }

  async add(parentPath: string, name: string, type: "file" | "folder") {
    const res = await fetch(`${this.baseUrl}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentPath, name, type }),
    });
    if (!res.ok) throw new Error("Failed to add node");
  }

  async delete(fullPath: string, type: "file" | "folder") {
    const res = await fetch(`${this.baseUrl}/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: fullPath, type }),
    });
    if (!res.ok) throw new Error("Failed to delete node");
  }

  async rename(fullPath: string, newName: string) {
    const res = await fetch(`${this.baseUrl}/rename`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: fullPath, newName }),
    });
    if (!res.ok) throw new Error("Failed to rename node");
  }

  async load(filePath: string): Promise<MarkdownFile> {
    const res = await fetch(`${this.baseUrl}/load?filename=${encodeURIComponent(filePath)}`);
    if (!res.ok) throw new Error("File not found");
    const data = await res.json();
    return new MarkdownFile(data);
  }

  async save(filePath: string, markdowncontent: string, metaData: MarkdownMetaData) {
    const res = await fetch(`${this.baseUrl}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: filePath, content: markdowncontent, metadata: metaData }),
    });
    if (!res.ok) throw new Error("Failed to save file");
  }
}
