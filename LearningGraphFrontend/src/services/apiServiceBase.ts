export class ApiServiceBase {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async post(endpoint: string, body: unknown, customHeaders?: Record<string, string>) {
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

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${res.status}`);
    }

    if (res.status === 204) return null;
    return await res.json();
  }

  protected async get(endpoint: string) {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Unauthorized or Network Error");
    return await res.json();
  }
}