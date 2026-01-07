import { ApiServiceBase } from "./apiServiceBase";

export interface UserMinimalInfo {
  userName: string;
}

export class AuthApiService extends ApiServiceBase {
  constructor() {
    super("http://localhost:5072/api/auth");
  }

  async login(
    username: string,
    password: string
  ): Promise<{ username: string }> {
    return await this.post("/login", {
      userName: username,
      password: password,
    });
  }

  async getMe(): Promise<UserMinimalInfo> {
    return await this.get("/me");
  }

  async logout() {
    
  }
}
