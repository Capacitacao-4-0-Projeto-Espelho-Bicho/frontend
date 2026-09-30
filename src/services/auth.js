import { request } from "./api";

// Contrato conforme tests/test_auth.py do backend:
// POST /api/auth/register -> 201 { user: {...} } | 400 campo faltando | 409 e-mail duplicado
// POST /api/auth/login    -> 200 { access_token } | 401 credenciais inválidas

export function registrar({ nome, email, senha, ambiente, tempo, recursos, interlocutores }) {
  return request("/api/auth/register", {
    method: "POST",
    body: { nome, email, senha, ambiente, tempo, recursos, interlocutores },
  });
}

export function login({ email, senha }) {
  return request("/api/auth/login", {
    method: "POST",
    body: { email, senha },
  });
}
