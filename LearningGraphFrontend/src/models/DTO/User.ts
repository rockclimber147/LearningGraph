export interface UserMinimalInfo {
  userName: string | null;
}

export interface UserLoginInfo extends UserMinimalInfo {
  password: string | null;
}

export interface UserFullInfo extends UserLoginInfo {
  refreshToken: string | null;
  refreshTokenExpiry: string | null;
}
