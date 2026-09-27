// Endpoints do backend (ajuste a URL base se o servidor não estiver na mesma origem)
const API_BASE = "";

async function enviarFormulario(endpoint, dados, elMsg) {
  elMsg.textContent = "";
  elMsg.className = "msg";

  try {
    const resposta = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
      credentials: "include", // permite sessão via cookie, se o backend usar
    });

    const corpo = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      elMsg.textContent = corpo.erro || "Não foi possível concluir. Verifique os dados.";
      elMsg.className = "msg error";
      return null;
    }

    elMsg.textContent = corpo.mensagem || "Operação concluída.";
    elMsg.className = "msg ok";
    return corpo;
  } catch (e) {
    elMsg.textContent = "Erro de conexão com o servidor.";
    elMsg.className = "msg error";
    return null;
  }
}

function validarCredenciais(usuario, senha, elMsg) {
  if (!usuario || !senha) {
    elMsg.textContent = "Preencha usuário e senha.";
    elMsg.className = "msg error";
    return false;
  }
  if (senha.length < 6) {
    elMsg.textContent = "A senha deve ter pelo menos 6 caracteres.";
    elMsg.className = "msg error";
    return false;
  }
  return true;
}

// --- Cadastro ---
const formCadastro = document.getElementById("form-cadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;
    const msg = document.getElementById("msg");

    if (!validarCredenciais(usuario, senha, msg)) return;

    await enviarFormulario("/api/cadastro", { usuario, senha }, msg);
  });
}

// --- Login ---
const formLogin = document.getElementById("form-login");
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;
    const msg = document.getElementById("msg");

    if (!validarCredenciais(usuario, senha, msg)) return;

    const resultado = await enviarFormulario("/api/login", { usuario, senha }, msg);
    if (resultado) {
      // redirecionar após login bem-sucedido, se aplicável
      // window.location.href = "/dashboard.html";
    }
  });
}
