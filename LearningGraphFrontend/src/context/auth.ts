import { 
  createContext, // creates a React Context, which is a way to share state globally without passing props through every componen
  } from "react";


export type AuthContextType = {
  username: string | null; // stores the currently logged in username
  login: (username: string, password: string) => boolean; // function that accepts username and password and returns success bool
  logout: () => void; // logs out the user
};

export const AuthContext = createContext<AuthContextType | null>(null); // Creates react context callled Authcontext with bnull as default value
