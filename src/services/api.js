// Cliente HTTP único do projeto. Todas as chamadas ao backend passam por aqui.
const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const TOKEN_KEY = "access_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

// O back-end devolve { error: "..." } (rotas em app/routes/auth.py);
// as outras chaves ficam por compatibilidade.
function extrairMensagem(body, status) {
  const msg = body?.erro || body?.error || body?.mensagem || body?.message || body?.msg;
  if (msg) return msg;
  if (status === 401) return "E-mail ou senha incorretos.";
  if (status === 409) return "Este e-mail já está cadastrado.";
  if (status === 400) return "Dados inválidos. Verifique os campos.";
  if (status >= 500) return `O servidor encontrou um erro (código ${status}). Tente de novo mais tarde.`;
  if (status) return `Não foi possível concluir (código ${status}). Tente novamente.`;
  return "Não foi possível concluir. Tente novamente.";
}

// O Render gratuito dorme depois de 15 min sem uso e leva até ~1 min para
// acordar (SCRUM-86). Por isso: espera longa, aviso quando demora e uma
// nova tentativa se o Render responder 502/503/504 enquanto sobe.
const TEMPO_LIMITE = 90_000;
const AVISO_DEMORA = 4_000;
const ACORDANDO = new Set([502, 503, 504]);

export async function request(path, { method = "GET", body, auth = false, aoDemorar } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), TEMPO_LIMITE);
  const aviso = aoDemorar ? setTimeout(aoDemorar, AVISO_DEMORA) : null;

  try {
    for (let tentativa = 0; ; tentativa++) {
      let resposta;
      try {
        resposta = await fetch(`${API_BASE}${path}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controle.signal,
        });
      } catch (erro) {
        if (erro.name === "AbortError") {
          throw new ApiError("O servidor demorou demais para responder. Tente de novo em instantes.", 0, null);
        }
        throw new ApiError("Erro de conexão com o servidor.", 0, null);
      }

      if (ACORDANDO.has(resposta.status) && tentativa < 2) {
        aoDemorar?.();
        await new Promise((r) => setTimeout(r, 5_000));
        continue;
      }

      const dados = await resposta.json().catch(() => null);
      if (!resposta.ok) {
        throw new ApiError(extrairMensagem(dados, resposta.status), resposta.status, dados);
      }
      return dados;
    }
  } finally {
    clearTimeout(limite);
    clearTimeout(aviso);
  }
}

// Chamada leve só para acordar o servidor enquanto a pessoa preenche o
// formulário. A rota só aceita POST, então a resposta é 405, e tudo bem:
// o que importa é o Render começar a subir.
export function acordarServidor() {
  fetch(`${API_BASE}/api/auth/login`, { method: "GET" }).catch(() => {});
}
