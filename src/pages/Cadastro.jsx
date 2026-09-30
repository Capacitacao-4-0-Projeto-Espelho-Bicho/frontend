import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrar } from "../services/auth";
import { Campo, Selecao } from "../components/Campo";
import {
  OPCOES_AMBIENTE,
  OPCOES_TEMPO,
  OPCOES_RECURSOS,
  OPCOES_INTERLOCUTORES,
} from "../constants/perfil";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MIN = 6;

const INICIAL = {
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
  ambiente: "",
  tempo: "",
  recursos: "",
  interlocutores: "",
};

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INICIAL);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validar() {
    const n = {};
    if (!form.nome.trim()) n.nome = "Informe seu nome.";
    if (!EMAIL_REGEX.test(form.email.trim())) n.email = "Informe um e-mail válido.";
    if (form.senha.length < SENHA_MIN) n.senha = `A senha deve ter pelo menos ${SENHA_MIN} caracteres.`;
    if (!form.confirmarSenha) n.confirmarSenha = "Confirme a senha.";
    else if (form.confirmarSenha !== form.senha) n.confirmarSenha = "As senhas não conferem.";
    if (!form.ambiente) n.ambiente = "Selecione uma opção.";
    if (!form.tempo) n.tempo = "Selecione uma opção.";
    if (!form.recursos) n.recursos = "Selecione uma opção.";
    if (!form.interlocutores) n.interlocutores = "Selecione uma opção.";
    setErros(n);
    return Object.keys(n).length === 0;
  }

  async function enviar(e) {
    e.preventDefault();
    setErroGeral("");
    if (!validar()) return;

    setEnviando(true);
    try {
      const { confirmarSenha, ...dados } = form;
      await registrar({ ...dados, nome: dados.nome.trim(), email: dados.email.trim() });
      navigate("/login", { state: { cadastroOk: true, email: dados.email.trim() } });
    } catch (err) {
      if (err.status === 409) setErros((prev) => ({ ...prev, email: err.message }));
      else setErroGeral(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="pagina-auth">
      <section className="card">
        <h1>Criar conta</h1>

        <form onSubmit={enviar} noValidate>
          <Campo id="nome" rotulo="Nome" erro={erros.nome}>
            <input id="nome" name="nome" autoComplete="name" value={form.nome} onChange={atualizar} aria-invalid={Boolean(erros.nome)} />
          </Campo>

          <Campo id="email" rotulo="E-mail" erro={erros.email}>
            <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={atualizar} aria-invalid={Boolean(erros.email)} />
          </Campo>

          <Campo id="senha" rotulo="Senha" erro={erros.senha}>
            <input id="senha" name="senha" type="password" autoComplete="new-password" value={form.senha} onChange={atualizar} aria-invalid={Boolean(erros.senha)} />
          </Campo>

          <Campo id="confirmarSenha" rotulo="Confirmar senha" erro={erros.confirmarSenha}>
            <input id="confirmarSenha" name="confirmarSenha" type="password" autoComplete="new-password" value={form.confirmarSenha} onChange={atualizar} aria-invalid={Boolean(erros.confirmarSenha)} />
          </Campo>

          <fieldset className="grupo">
            <legend>Sobre sua rotina de estudo</legend>
            <Selecao id="ambiente" rotulo="Ambiente" opcoes={OPCOES_AMBIENTE} value={form.ambiente} onChange={atualizar} erro={erros.ambiente} />
            <Selecao id="tempo" rotulo="Tempo disponível" opcoes={OPCOES_TEMPO} value={form.tempo} onChange={atualizar} erro={erros.tempo} />
            <Selecao id="recursos" rotulo="Recursos" opcoes={OPCOES_RECURSOS} value={form.recursos} onChange={atualizar} erro={erros.recursos} />
            <Selecao id="interlocutores" rotulo="Com quem" opcoes={OPCOES_INTERLOCUTORES} value={form.interlocutores} onChange={atualizar} erro={erros.interlocutores} />
          </fieldset>

          {erroGeral && (
            <p className="aviso aviso-erro" role="alert">
              {erroGeral}
            </p>
          )}

          <button type="submit" disabled={enviando}>
            {enviando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="troca">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
