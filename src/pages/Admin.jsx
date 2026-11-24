import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCatalogo } from "../hooks/useCatalogo";
import { listarAtividades } from "../services/atividades";
import { FundoHome, useTema } from "../components/FundoHome";
import { FormularioAtividade } from "../components/FormularioAtividade";
import { TabelaAtividades } from "../components/TabelaAtividades";
import "../styles/home.css";
import "../styles/fundos.css";
import "../styles/moderno.css";
import "../styles/admin.css";

// Painel admin (mockup "Painel de Controle e Gestão"): cadastra tarefas
// práticas (POST /api/atividades) e lista as já cadastradas.
// O back-end ainda não devolve o papel da pessoa logada (sem GET /me, e o
// login só entrega o token), então a página abre para qualquer pessoa logada
// e quem não for gestor/admin recebe 403 ao publicar. Quando o papel estiver
// disponível, esconder a rota de quem não tem permissão.

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

export default function Admin() {
  const { nomeCompleto, sair } = useAuth();
  const tema = useTema();
  const catalogo = useCatalogo();

  const [atividades, setAtividades] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [demorandoLista, setDemorandoLista] = useState(false);
  const [erroLista, setErroLista] = useState("");
  const [tentativaLista, setTentativaLista] = useState(0);
  const [aviso, setAviso] = useState("");
  const timer = useRef();

  useEffect(() => {
    let ativo = true;
    setCarregandoLista(true);
    setErroLista("");
    listarAtividades({}, { aoDemorar: () => ativo && setDemorandoLista(true) })
      .then((lista) => ativo && setAtividades(lista))
      .catch((e) => ativo && setErroLista(e.message))
      .finally(() => {
        if (!ativo) return;
        setCarregandoLista(false);
        setDemorandoLista(false);
      });
    return () => {
      ativo = false;
    };
  }, [tentativaLista]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // o 201 devolve a atividade completa: entra no topo da lista sem nova consulta
  const aoCadastrar = useCallback((nova) => {
    setAtividades((lista) => [nova, ...lista.filter((a) => a.id !== nova.id)]);
    setAviso("Tarefa cadastrada e publicada.");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAviso(""), 4000);
  }, []);

  const conectando = (catalogo.carregando && catalogo.demorando) || (carregandoLista && demorandoLista);

  return (
    <div className="home admin">
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <FundoHome tema={tema} />

      <main className="admin-pagina" id="conteudo" tabIndex={-1}>
        <header className="admin-cartao admin-topo">
          <div className="admin-usuario">
            <span className="admin-avatar" aria-hidden="true">
              {iniciais(nomeCompleto)}
            </span>
            <div>
              <p className="admin-nome">{nomeCompleto}</p>
              <p className="admin-papel">Administrador do Sistema</p>
            </div>
          </div>
          <div className="admin-topo-acoes">
            <Link to="/" className="admin-link">
              Voltar à Home
            </Link>
            <button type="button" className="admin-link" onClick={sair}>
              Sair
            </button>
            <span className="admin-selo">Capacitação 4.0 · Painel Admin</span>
          </div>
        </header>

        <section className="admin-titulo">
          <h1>Painel de controle e gestão</h1>
          <p>Gerenciamento de competências socioemocionais, sub-trilhas e registro de microatividades práticas.</p>
        </section>

        {conectando && (
          <p className="aviso aviso-espera" role="status">
            Conectando ao servidor. Se ele estava parado, pode levar até 1 minuto…
          </p>
        )}
        {catalogo.erro && (
          <div className="aviso aviso-erro admin-aviso-linha" role="alert">
            <span>Não foi possível carregar competências e sub-trilhas. {catalogo.erro}</span>
            <button type="button" className="admin-link" onClick={catalogo.recarregar}>
              Tentar de novo
            </button>
          </div>
        )}

        <div className="admin-grade">
          <FormularioAtividade catalogo={catalogo} aoCadastrar={aoCadastrar} />
          <TabelaAtividades
            atividades={atividades}
            nomes={catalogo.nomes}
            carregando={carregandoLista || catalogo.carregando}
            erro={erroLista}
            aoTentarDeNovo={() => setTentativaLista((t) => t + 1)}
          />
        </div>

        <footer className="home-rodape">© 2026 Capacitação 4.0</footer>
      </main>

      <div className={`home-aviso${aviso ? " visivel" : ""}`} role="status" aria-live="polite">
        <span>{aviso}</span>
      </div>
    </div>
  );
}
