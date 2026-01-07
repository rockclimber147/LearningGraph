import { type FileNode } from "../components/FileTree/FileTree";
import { MarkdownFile, MarkdownMetaData } from "../models/markdown";
import { ApiServiceBase } from "./apiServiceBase";

export class FilesApiService extends ApiServiceBase {
  constructor() {
    super("http://localhost:5072/api/files");
  }

  async fetchTree(): Promise<FileNode> {
    return await this.get("/tree");
  }

  async add(parentPath: string, name: string, type: "file" | "folder"): Promise<void> {
    await this.post("/add", { parentPath, name, type });
  }

  async delete(fullPath: string, type: "file" | "folder"): Promise<void> {
    await this.post("/delete", { path: fullPath, type });
  }

  async rename(fullPath: string, newName: string): Promise<void> {
    await this.post("/rename", { path: fullPath, newName });
  }

  async load(filePath: string): Promise<MarkdownFile> {
    const data = await this.get(`/load?filename=${encodeURIComponent(filePath)}`);
    return new MarkdownFile(data);
  }

  async save(filePath: string, markdowncontent: string, metaData: MarkdownMetaData): Promise<void> {
    await this.post("/save", { 
      filename: filePath, 
      content: markdowncontent, 
      metadata: metaData 
    });
  }
}