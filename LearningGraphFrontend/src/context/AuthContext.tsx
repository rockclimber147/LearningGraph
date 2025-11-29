import { type ReactNode, useState } from "react";
import { AuthContext } from "./auth";

export type AuthContextType = {
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage to avoid useEffect
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem("username");
  });

  const login = (user: string, pass: string) => {
    if (!pass) return false;

    setUsername(user);
    localStorage.setItem("username", user); // persist login
    return true;
  };

  const logout = () => {
    setUsername(null);
    localStorage.removeItem("username"); // clear persisted login
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
