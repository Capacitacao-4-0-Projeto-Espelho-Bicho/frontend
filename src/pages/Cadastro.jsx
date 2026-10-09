import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrar } from "../services/auth";
import { Campo, GrupoRadio } from "../components/Campo";
import { PERGUNTAS_ETAPA_1, PERGUNTAS_ETAPA_2 } from "../constants/perfil";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MIN = 8; // conforme o Figma ("pelo menos 8 caracteres")

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

// Cadastro em 2 etapas, como no Figma.
// Etapa 1: dados de acesso + ambiente, interlocutores e tempo.
// Etapa 2: recursos materiais.
// O Figma não tem campos de e-mail e senha no cadastro, mas o backend exige,
// então eles entram na etapa 1.
// A autoavaliação de soft skills (níveis 1 a 4) do Figma ficou de fora:
// o backend ainda não recebe esses dados no registro.
export default function Cadastro() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  // direção da última troca de etapa: define de que lado o conteúdo entra.
  // "inicial" não anima, porque a troca de tela já anima a primeira etapa.
  const [direcao, setDirecao] = useState("inicial");
  const [form, setForm] = useState(INICIAL);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validarEtapa1() {
    const n = {};
    if (!form.nome.trim()) n.nome = "Informe como você quer ser chamado.";
    if (!EMAIL_REGEX.test(form.email.trim())) n.email = "Informe um e-mail válido.";
    if (form.senha.length < SENHA_MIN) n.senha = `A senha deve ter pelo menos ${SENHA_MIN} caracteres.`;
    if (!form.confirmarSenha) n.confirmarSenha = "Confirme a senha.";
    else if (form.confirmarSenha !== form.senha) n.confirmarSenha = "As senhas não conferem.";
    for (const p of PERGUNTAS_ETAPA_1) if (!form[p.campo]) n[p.campo] = "Selecione uma opção.";
    setErros(n);
    return Object.keys(n).length === 0;
  }

  function validarEtapa2() {
    const n = {};
    for (const p of PERGUNTAS_ETAPA_2) if (!form[p.campo]) n[p.campo] = "Selecione uma opção.";
    setErros(n);
    return Object.keys(n).length === 0;
  }

  function irPara(nova) {
    setDirecao(nova > etapa ? "avancar" : "voltar");
    setEtapa(nova);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function avancar(e) {
    e.preventDefault();
    if (validarEtapa1()) irPara(2);
  }

  async function enviar(e) {
    e.preventDefault();
    setErroGeral("");
    if (!validarEtapa2()) return;

    setEnviando(true);
    try {
      const { confirmarSenha, ...dados } = form;
      await registrar({ ...dados, nome: dados.nome.trim(), email: dados.email.trim() });
      navigate("/login", { state: { cadastroOk: true, email: dados.email.trim() } });
    } catch (err) {
      if (err.status === 409) {
        // e-mail duplicado: volta para a etapa 1 e mostra no campo
        setErros({ email: err.message });
        irPara(1);
      } else {
        setErroGeral(err.message);
      }
    } finally {
      setEnviando(false);
    }
  }

  const perguntas = etapa === 1 ? PERGUNTAS_ETAPA_1 : PERGUNTAS_ETAPA_2;

  return (
    <>
      <h1 className="titulo-menor">Criar conta</h1>
      <div className="progresso">
        <span className="progresso-trilho" aria-hidden="true">
          <span className="progresso-barra" style={{ transform: `scaleX(${etapa / 2})` }} />
        </span>
        <span className="etapa-rotulo">Etapa {etapa} de 2</span>
      </div>

      <form onSubmit={etapa === 1 ? avancar : enviar} noValidate>
        {/* key = etapa: o bloco remonta e desliza a partir do lado da navegação */}
        <div key={etapa} className={`etapa-conteudo entra-${direcao}`}>
        {etapa === 1 && (
          <>
            <Campo id="nome" rotulo="Nome de usuário" erro={erros.nome}>
              <input id="nome" name="nome" autoComplete="name" placeholder="Como você quer ser chamado?" value={form.nome} onChange={atualizar} aria-invalid={Boolean(erros.nome)} />
            </Campo>
            <Campo id="email" rotulo="E-mail" erro={erros.email}>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="exemplo@email.com" value={form.email} onChange={atualizar} aria-invalid={Boolean(erros.email)} />
            </Campo>
            <Campo id="senha" rotulo="Senha" erro={erros.senha}>
              <input id="senha" name="senha" type="password" autoComplete="new-password" placeholder={`Pelo menos ${SENHA_MIN} caracteres`} value={form.senha} onChange={atualizar} aria-invalid={Boolean(erros.senha)} />
            </Campo>
            <Campo id="confirmarSenha" rotulo="Confirmar senha" erro={erros.confirmarSenha}>
              <input id="confirmarSenha" name="confirmarSenha" type="password" autoComplete="new-password" value={form.confirmarSenha} onChange={atualizar} aria-invalid={Boolean(erros.confirmarSenha)} />
            </Campo>
          </>
        )}

        {perguntas.map((p) => (
          <GrupoRadio key={p.campo} {...p} valor={form[p.campo]} onChange={atualizar} erro={erros[p.campo]} />
        ))}
        </div>

        {erroGeral && (
          <p className="aviso aviso-erro" role="alert">
            {erroGeral}
          </p>
        )}

        <div className="acoes-etapa">
          {etapa === 1 ? (
            <Link to="/login" className="botao-secundario">
              Cancelar
            </Link>
          ) : (
            <button type="button" className="botao-secundario" onClick={() => { setErros({}); irPara(1); }}>
              Voltar
            </button>
          )}
          <button type="submit" className="botao-azul" disabled={enviando} aria-busy={enviando}>
            {enviando && <span className="spinner" aria-hidden="true" />}
            {etapa === 1 ? "Próximo" : enviando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </form>

      <p className="troca">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </>
  );
}
