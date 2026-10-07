import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { getToken, setToken } from "../services/api";
import * as authService from "../services/auth";

const AuthContext = createContext(null);
const EMAIL_KEY = "usuario_email";

function lerEmail() {
  try {
    return localStorage.getItem(EMAIL_KEY);
  } catch {
    return null;
  }
}

function gravarEmail(email) {
  try {
    if (email) localStorage.setItem(EMAIL_KEY, email);
    else localStorage.removeItem(EMAIL_KEY);
  } catch {
    // sem armazenamento disponível: o nome cai no padrão
  }
}

// O login devolve só o access_token. Se o JWT trouxer nome ou e-mail no
// payload, usamos; senão, o e-mail digitado no login. Quando o backend
// tiver uma rota de perfil (ex.: GET /api/auth/me), trocar por ela.
function lerPayload(token) {
  try {
    const parte = token.split(".")[1];
    const json = atob(parte.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return {};
  }
}

function nomeParaExibir(token, email) {
  const p = lerPayload(token || "");
  const sub = typeof p.sub === "string" ? p.sub : "";
  const candidato = p.nome || p.name || p.email || (sub.includes("@") ? sub : "") || email || "";
  return candidato.split("@")[0] || "Usuário";
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [email, setEmail] = useState(() => lerEmail());

  const entrar = useCallback(async (credenciais) => {
    const dados = await authService.login(credenciais);
    setToken(dados.access_token);
    setTokenState(dados.access_token);
    gravarEmail(credenciais.email);
    setEmail(credenciais.email);
    return dados;
  }, []);

  const sair = useCallback(() => {
    setToken(null);
    setTokenState(null);
    gravarEmail(null);
    setEmail(null);
  }, []);

  const nome = useMemo(() => nomeParaExibir(token, email), [token, email]);

  return (
    <AuthContext.Provider value={{ token, autenticado: Boolean(token), nome, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
