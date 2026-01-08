import type {
  ApiResponse,
  ApiResponseWithContent,
} from "../models/DTO/ApiResponse";

export class ApiServiceBase {
  protected baseUrl: string;

  private static isRefreshing = false;
  private static refreshSubscribers: ((success: boolean) => void)[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(
    res: Response,
    requestFn: () => Promise<Response>
  ): Promise<T> {
    if (res.status === 401) {
      if (ApiServiceBase.isRefreshing) {
        const success = await new Promise<boolean>((resolve) => {
          ApiServiceBase.refreshSubscribers.push(resolve);
        });

        if (success) {
          const retryRes = await requestFn();
          return (await retryRes.json()) as T;
        } else {
          throw new Error("Session expired");
        }
      }

      ApiServiceBase.isRefreshing = true;

      try {
        const refreshRes = await fetch("http://localhost:5072/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          this.onTokenRefreshed(true);
          const retryRes = await requestFn();
          const data = await retryRes.json();
          return data as T;
        } else {
          this.onTokenRefreshed(false);
          throw new Error("Session expired");
        }
      } catch (err) {
        this.onTokenRefreshed(false);
        throw err;
      } finally {
        ApiServiceBase.isRefreshing = false;
      }
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok || (data && data.success === false)) {
      throw new Error(data.message || `API Error: ${res.status}`);
    }

    return data as T;
  }

  private onTokenRefreshed(success: boolean) {
    ApiServiceBase.refreshSubscribers.forEach((callback) => callback(success));
    ApiServiceBase.refreshSubscribers = [];
  }

  protected async get<T>(endpoint: string): Promise<ApiResponseWithContent<T>> {
    const requestFn = () => fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      credentials: "include",
    });

    const res = await requestFn();
    return this.handleResponse(res, requestFn);
  }

  protected async post<T = void>(
    endpoint: string,
    body: unknown
  ): Promise<T extends void ? ApiResponse : ApiResponseWithContent<T>> {
    const requestFn = () => fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const res = await requestFn();
    return this.handleResponse(res, requestFn);
  }
}