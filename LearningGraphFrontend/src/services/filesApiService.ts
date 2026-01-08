import { ApiServiceBase } from "./apiServiceBase";
import type {
  FileNode,
  MarkdownFileContent,
  AddNodeRequest,
  DeleteNodeRequest,
  RenameNodeRequest,
  SaveFileRequest,
} from "../models/DTO/FileTree";
import type { ApiResponse } from "../models/DTO/ApiResponse";

export class FilesApiService extends ApiServiceBase {
  constructor() {
    super("http://localhost:5072/api/files");
  }

  async fetchTree(): Promise<FileNode | null> {
    const response = await this.get<FileNode>("/tree");
    return response.content;
  }

  async add(request: AddNodeRequest): Promise<ApiResponse> {
    const response = await this.post("/add", request);
    return response;
  }

  async delete(request: DeleteNodeRequest): Promise<ApiResponse> {
    const response = await this.post("/delete", request);
    return response;
  }

  async rename(request: RenameNodeRequest): Promise<ApiResponse> {
    const response = await this.post("/rename", request);
    return response;
  }

  async load(filePath: string): Promise<MarkdownFileContent | null> {
    const response = await this.get<MarkdownFileContent>(
      `/load?filename=${encodeURIComponent(filePath)}`
    );
    return response.content;
  }

  async save(request: SaveFileRequest): Promise<ApiResponse> {
    const response = await this.post("/save", request);
    return response;
  }
}
