import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Campo } from "../components/Campo";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Aviso de "conta criada" some na primeira tentativa de login,
  // para não aparecer junto com uma mensagem de erro.
  const [cadastroOk, setCadastroOk] = useState(Boolean(location.state?.cadastroOk));

  const [form, setForm] = useState({ email: location.state?.email ?? "", senha: "" });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validar() {
    const novos = {};
    if (!EMAIL_REGEX.test(form.email.trim())) novos.email = "Informe um e-mail válido.";
    if (!form.senha) novos.senha = "Informe a senha.";
    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  async function enviar(e) {
    e.preventDefault();
    setErroGeral("");
    setCadastroOk(false);
    if (!validar()) return;

    setEnviando(true);
    try {
      await entrar({ email: form.email.trim(), senha: form.senha });
      navigate("/", { replace: true });
    } catch (err) {
      setErroGeral(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="pagina-auth">
      <section className="card">
        <h1>Entrar</h1>

        {cadastroOk && <p className="aviso aviso-ok">Conta criada. Faça login para continuar.</p>}

        <form onSubmit={enviar} noValidate>
          <Campo id="email" rotulo="E-mail" erro={erros.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={atualizar}
              aria-invalid={Boolean(erros.email)}
            />
          </Campo>

          <Campo id="senha" rotulo="Senha" erro={erros.senha}>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              value={form.senha}
              onChange={atualizar}
              aria-invalid={Boolean(erros.senha)}
            />
          </Campo>

          {erroGeral && (
            <p className="aviso aviso-erro" role="alert">
              {erroGeral}
            </p>
          )}

          <button type="submit" disabled={enviando}>
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="troca">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </section>
    </main>
  );
}
