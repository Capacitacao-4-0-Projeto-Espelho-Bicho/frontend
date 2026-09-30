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

// O formato de erro do backend ainda não está documentado (SCRUM-80),
// então aceita as chaves mais prováveis.
function extrairMensagem(body, status) {
  const msg = body?.erro || body?.error || body?.mensagem || body?.message || body?.msg;
  if (msg) return msg;
  if (status === 401) return "E-mail ou senha incorretos.";
  if (status === 409) return "Este e-mail já está cadastrado.";
  if (status === 400) return "Dados inválidos. Verifique os campos.";
  return "Não foi possível concluir. Tente novamente.";
}

export async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let resposta;
  try {
    resposta = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Erro de conexão com o servidor.", 0, null);
  }

  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new ApiError(extrairMensagem(dados, resposta.status), resposta.status, dados);
  }
  return dados;
}
