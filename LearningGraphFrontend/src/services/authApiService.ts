import { ApiServiceBase } from "./apiServiceBase";
import type {
  UserLoginInfo,
  UserMinimalInfo,
  UserFullInfo,
} from "../models/DTO/User";

export class AuthApiService extends ApiServiceBase {
  constructor() {
    super("http://localhost:5072/api/auth");
  }

  async login(credentials: UserLoginInfo): Promise<UserFullInfo | null> {
    const response = await this.post<UserFullInfo>("/login", credentials);
    return response.content;
  }

  async getMe(): Promise<UserMinimalInfo | null> {
    const response = await this.get<UserMinimalInfo>("/me");
    return response.content;
  }

  async logout(): Promise<boolean> {
    const response = await this.post("/logout", {});
    return response.success;
  }
}
