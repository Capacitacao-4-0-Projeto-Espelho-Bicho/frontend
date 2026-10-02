import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Campo } from "../components/Campo";
import { IconeGoogle, IconeFacebook } from "../components/IconesSociais";

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
      // 401 = e-mail ou senha errados: mostra no campo de senha, como no Figma.
      if (err.status === 401) setErros({ senha: "E-mail ou senha incorretos." });
      else setErroGeral(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <h1>
        Bem vindo <span aria-hidden="true">👋</span>
      </h1>
      <p className="subtitulo">Pronto para continuar desenvolvendo suas habilidades socioemocionais?</p>
      <p className="subtitulo">
        Faça login para acessar seus diagnósticos, acompanhar suas atividades e evoluir suas
        competências.
      </p>

      {cadastroOk && <p className="aviso aviso-ok">Conta criada. Faça login para continuar.</p>}

      <form onSubmit={enviar} noValidate>
        <Campo id="email" rotulo="E-mail" erro={erros.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="exemplo@email.com"
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
            placeholder="Sua senha"
            value={form.senha}
            onChange={atualizar}
            aria-invalid={Boolean(erros.senha)}
          />
        </Campo>

        {/* Recuperação de senha ainda não tem rota no backend. */}
        <div className="linha-direita">
          <button type="button" className="link" disabled title="Em breve">
            Esqueceu a senha?
          </button>
        </div>

        {erroGeral && (
          <p className="aviso aviso-erro" role="alert">
            {erroGeral}
          </p>
        )}

        <button type="submit" className="botao-primario" disabled={enviando} aria-busy={enviando}>
          {enviando && <span className="spinner" aria-hidden="true" />}
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="divisor">
        <span>Ou entre com</span>
      </div>

      {/* Login social ainda não tem suporte no backend. */}
      <div className="sociais">
        <button type="button" className="botao-social" disabled title="Em breve">
          <IconeGoogle /> Google
        </button>
        <button type="button" className="botao-social" disabled title="Em breve">
          <IconeFacebook /> Facebook
        </button>
      </div>

      <p className="troca">
        Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </>
  );
}
