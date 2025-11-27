import { 
    type ReactNode, // Type representing anything React can render (strings, JSX elements, fragments, arrays)
    useState // React hook to store local component state
    } from "react";
import { AuthContext } from "./auth";

export type AuthContextType = {
  username: string | null; // stores the currently logged in username
  login: (username: string, password: string) => boolean; // function that accepts username and password and returns success bool
  logout: () => void; // logs out the user
};

export function AuthProvider({ children }: { children: ReactNode }) { // React component that wraps part of the app and provides auth state to all children
  const [username, setUsername] = useState<string | null>(null); // stores currently logged in username

  const login = (user: string, pass: string) => {
    if (!pass) return false;
    setUsername(user);
    return true;
  };

  const logout = () => setUsername(null);

  return (
    // makes username, login, logout accessible in any child component wrapped by this
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
