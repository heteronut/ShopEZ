import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopez_user")) || null;
    } catch {
      return null;
    }
  });

  function store(session) {
    localStorage.setItem("shopez_token", session.token);
    localStorage.setItem("shopez_user", JSON.stringify(session.user));
    setUser(session.user);
  }

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    store(data);
    return data.user;
  }

  async function register(username, email, password) {
    const { data } = await api.post("/auth/register", { username, email, password });
    store(data);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("shopez_token");
    localStorage.removeItem("shopez_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
