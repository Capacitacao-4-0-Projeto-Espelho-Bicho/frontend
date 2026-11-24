import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { getToken, setToken, SESSAO_EXPIRADA } from "../services/api";
import * as authService from "../services/auth";

const AuthContext = createContext(null);
const EMAIL_KEY = "usuario_email";
const NOME_KEY = (email) => `usuario_nome:${email}`;

// O login devolve só o token (com o id no "sub"), sem o nome. O cadastro
// devolve o nome, então guardamos ele por e-mail para mostrar na Home.
function lerNome(email) {
  try {
    return email ? localStorage.getItem(NOME_KEY(email)) : null;
  } catch {
    return null;
  }
}

export function lembrarNome(email, nome) {
  try {
    if (email && nome) localStorage.setItem(NOME_KEY(email), nome);
  } catch {
    // sem armazenamento: a Home usa o começo do e-mail
  }
}

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
  const salvo = lerNome(email);
  if (salvo) return salvo.split(" ")[0];
  const p = lerPayload(token || "");
  const sub = typeof p.sub === "string" ? p.sub : "";
  const candidato = p.nome || p.name || p.email || (sub.includes("@") ? sub : "") || email || "";
  const base = candidato.split("@")[0] || "Usuário";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [email, setEmail] = useState(() => lerEmail());
  // true quando uma chamada autenticada perdeu a sessão; a tela de login avisa
  const [sessaoExpirada, setSessaoExpirada] = useState(false);

  const entrar = useCallback(async (credenciais, opcoes) => {
    const dados = await authService.login(credenciais, opcoes);
    setToken(dados.access_token);
    setTokenState(dados.access_token);
    gravarEmail(credenciais.email);
    setEmail(credenciais.email);
    setSessaoExpirada(false);
    return dados;
  }, []);

  const sair = useCallback(() => {
    setToken(null);
    setTokenState(null);
    gravarEmail(null);
    setEmail(null);
  }, []);

  // api.js já apagou o token; aqui o estado acompanha e RotaProtegida leva ao login
  useEffect(() => {
    const aoExpirar = () => {
      sair();
      setSessaoExpirada(true);
    };
    window.addEventListener(SESSAO_EXPIRADA, aoExpirar);
    return () => window.removeEventListener(SESSAO_EXPIRADA, aoExpirar);
  }, [sair]);

  const nome = useMemo(() => nomeParaExibir(token, email), [token, email]);
  // nome completo guardado no cadastro; sem ele, cai no nome curto
  const nomeCompleto = useMemo(() => lerNome(email) || nome, [email, nome]);

  return (
    <AuthContext.Provider
      value={{ token, autenticado: Boolean(token), nome, nomeCompleto, sessaoExpirada, entrar, sair }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
