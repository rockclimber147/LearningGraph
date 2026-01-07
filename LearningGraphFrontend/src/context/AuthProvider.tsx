import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext"; // Import from the file above
import { AuthApiService } from "../services/authApiService";

const authApi = new AuthApiService();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await authApi.getMe();
        setUsername(res.userName);
      } catch {
        setUsername(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (user: string, pass: string) => {
    const res = await authApi.login(user, pass);
    setUsername(res.username);
  };

  const logout = async () => {
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}