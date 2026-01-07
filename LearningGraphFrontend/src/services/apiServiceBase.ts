import type { ApiResponse, ApiResponseWithContent } from "../models/DTO/ApiResponse";

export class ApiServiceBase {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json().catch(() => ({}));

    if (!res.ok || (data && data.success === false)) {
      const errorMessage = data.message || `API Error: ${res.status}`;
      throw new Error(errorMessage);
    }

    return data as T;
  }

  protected async post<T = void>(
    endpoint: string, 
    body: unknown, 
    customHeaders?: Record<string, string>
  ): Promise<T extends void ? ApiResponse : ApiResponseWithContent<T>> {
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: headers,
      credentials: "include",
      body: JSON.stringify(body),
    });

    return this.handleResponse(res);
  }

  protected async get<T>(endpoint: string): Promise<ApiResponseWithContent<T>> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      credentials: "include",
    });

    return this.handleResponse(res);
  }
}