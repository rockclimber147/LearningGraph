import { ApiServiceBase } from "./apiServiceBase";
import type {
  FileNode,
  MarkdownFileContent,
  AddNodeRequest,
  DeleteNodeRequest,
  RenameNodeRequest,
  SaveFileRequest,
} from "../models/DTO/FileTree";

export class FilesApiService extends ApiServiceBase {
  constructor() {
    super("http://localhost:5072/api/files");
  }

  async fetchTree(): Promise<FileNode | null> {
    const response = await this.get<FileNode>("/tree");
    return response.content;
  }

  async add(request: AddNodeRequest): Promise<boolean> {
    const response = await this.post("/add", request);
    return response.success;
  }

  async delete(request: DeleteNodeRequest): Promise<boolean> {
    const response = await this.post("/delete", request);
    return response.success;
  }

  async rename(request: RenameNodeRequest): Promise<boolean> {
    const response = await this.post("/rename", request);
    return response.success;
  }

  async load(filePath: string): Promise<MarkdownFileContent | null> {
    const response = await this.get<MarkdownFileContent>(
      `/load?filename=${encodeURIComponent(filePath)}`
    );
    return response.content;
  }

  async save(request: SaveFileRequest): Promise<boolean> {
    const response = await this.post("/save", request);
    return response.success;
  }
}
