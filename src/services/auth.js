import { request } from "./api";

// Contrato da API (app/routes/auth.py no back-end, documentado em /dev):
// POST /api/auth/register -> 201 { message, user: { id, nome, email } }
//                            400 { error } campo faltando | 409 { error } e-mail duplicado
// POST /api/auth/login    -> 200 { access_token } | 400/401 { error }

export function registrar({ nome, email, senha, ambiente, tempo, recursos, interlocutores }, opcoes = {}) {
  return request("/api/auth/register", {
    method: "POST",
    body: { nome, email, senha, ambiente, tempo, recursos, interlocutores },
    ...opcoes,
  });
}

export function login({ email, senha }, opcoes = {}) {
  return request("/api/auth/login", {
    method: "POST",
    body: { email, senha },
    ...opcoes,
  });
}
