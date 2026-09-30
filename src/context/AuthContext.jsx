import { createContext, useContext, useState, useCallback } from "react";
import { getToken, setToken } from "../services/api";
import * as authService from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());

  const entrar = useCallback(async (credenciais) => {
    const dados = await authService.login(credenciais);
    setToken(dados.access_token);
    setTokenState(dados.access_token);
    return dados;
  }, []);

  const sair = useCallback(() => {
    setToken(null);
    setTokenState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, autenticado: Boolean(token), entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
