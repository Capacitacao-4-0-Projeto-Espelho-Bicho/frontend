import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTransicao } from "../hooks/useTransicao";
import { Trilha } from "../components/Trilha";
import { EtapaCartao, TrofeuCartao } from "../components/EtapaCartao";
import { MISSAO_DEMO } from "../data/missaoDemo";
import { FundoHome, useTema } from "../components/FundoHome";
import { LogoCerebro } from "../components/LogoCerebro";
import {
  IconeAtividades,
  IconeNotificacoes,
  IconeHome,
  IconeHistorico,
  IconeConfiguracoes,
  IconeBusca,
  IconeUsuario,
} from "../components/IconesHome";
import "../styles/home.css";
import "../styles/fundos.css";
import "../styles/moderno.css";

// Home conforme o Figma "HOME PAGE" (SCRUM-78) e a "Especificação das
// Missões e Etapas": a trilha mostra as 6 etapas da missão atual.
// O backend ainda não tem rotas de missão, etapas, atividades, notificações,
// histórico, configurações nem busca: a missão vem de dados fixos
// (MISSAO_DEMO) e o progresso vive só na memória desta tela.

const MENU = [
  { id: "atividades", rotulo: "Atividades", Icone: IconeAtividades },
  { id: "notificacoes", rotulo: "Notificações", Icone: IconeNotificacoes, soDesktop: true },
  { id: "home", rotulo: "Home", Icone: IconeHome, atual: true },
  { id: "historico", rotulo: "Histórico", Icone: IconeHistorico },
  { id: "configuracoes", rotulo: "Configurações", Icone: IconeConfiguracoes },
];

const MISSAO = MISSAO_DEMO;
const TOTAL = MISSAO.etapas.length;

function ItemMenu({ item, onEmBreve }) {
  return (
    <button
      type="button"
      className={`home-menu-item${item.atual ? " atual" : ""}${item.soDesktop ? " so-desktop" : ""}`}
      aria-current={item.atual ? "page" : undefined}
      onClick={() => onEmBreve(item.atual ? null : item.rotulo)}
    >
      <item.Icone className="home-menu-icone" />
      <span>{item.rotulo}</span>
    </button>
  );
}

export default function Home() {
  const { nome, sair: encerrar } = useAuth();
  const navigate = useNavigate();
  const transicao = useTransicao();
  // sair com a transição de volta: o logo encolhe de volta para o painel do login
  const sair = () =>
    transicao(() => {
      encerrar();
      navigate("/login", { replace: true });
    }, "sair");
  const tema = useTema();
  const [aviso, setAviso] = useState("");
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [cartao, setCartao] = useState(null); // { indice, estado } | "trofeu"
  const [recusas, setRecusas] = useState({}); // índice da etapa -> nº de recusas
  const timer = useRef();
  const fecharCartao = useCallback(() => setCartao(null), []);

  // menu do celular fecha com Esc
  useEffect(() => {
    if (!menuAberto) return;
    const aoTeclar = (e) => e.key === "Escape" && setMenuAberto(false);
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [menuAberto]);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      window.removeEventListener("scroll", aoRolar);
      clearTimeout(timer.current);
    };
  }, []);

  function avisar(texto) {
    setAviso(texto);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAviso(""), 2800);
  }

  const emBreve = (rotulo) => {
    setMenuAberto(false);
    if (rotulo) avisar(`${rotulo}: em breve.`);
  };

  function aoClicarEtapa(etapa, estado) {
    setCartao({ indice: MISSAO.etapas.indexOf(etapa), estado });
  }

  // As atividades das etapas ainda não existem: na demonstração, começar
  // uma etapa já a marca como concluída para mostrar o avanço da trilha.
  function aoComecar() {
    const { indice } = cartao;
    setCartao(null);
    setEtapaAtual(indice + 1);
    avisar(
      indice + 1 < TOTAL
        ? `Etapa ${indice + 1} concluída (simulação). Próxima: ${MISSAO.etapas[indice + 1].tipo}.`
        : "Todas as etapas concluídas. Toque no troféu para fechar a missão."
    );
  }

  function aoRecusar({ pular }) {
    const { indice } = cartao;
    if (pular) {
      setCartao(null);
      setEtapaAtual(indice + 1);
      avisar("Etapa pulada por agora. O motivo fica registrado.");
      return;
    }
    setRecusas((r) => ({ ...r, [indice]: (r[indice] || 0) + 1 }));
  }

  const concluida = etapaAtual >= TOTAL;
  const progresso = etapaAtual / TOTAL;

  return (
    <div className="home">
      <FundoHome tema={tema} />
      <div className={`home-cabecalho${rolou ? " rolou" : ""}`}>
        <header className="home-topo">
          <div className="home-usuario">
            <button
              type="button"
              className={`home-hamburguer so-mobile${menuAberto ? " aberto" : ""}`}
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuAberto}
              aria-controls="menu-celular"
              onClick={() => setMenuAberto((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
            <IconeUsuario className="home-avatar" />
            <div className="home-usuario-texto">
              <span className="home-nome">{nome}</span>
              <button type="button" className="home-sair" onClick={sair}>
                Sair
              </button>
            </div>
          </div>

          <div className="home-logo">
            <LogoCerebro titulo="Capacitação 4.0" atrasoInicial={700} />
          </div>

          <div className="home-direita">
            <form
            className="home-busca so-desktop-flex"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              emBreve("Busca");
            }}
          >
            <IconeBusca className="home-busca-icone" />
            <input type="search" placeholder="Buscar" aria-label="Buscar" />
          </form>
            {/* no celular, o sino fica à direita e a busca vai para o menu */}
            <button
              type="button"
              className="home-sino so-mobile"
              aria-label="Notificações"
              onClick={() => emBreve("Notificações")}
            >
              <IconeNotificacoes className="home-sino-icone" />
            </button>
          </div>
        </header>

        <nav className="home-menu" aria-label="Principal">
          {MENU.map((item) => (
            <ItemMenu key={item.id} item={item} onEmBreve={emBreve} />
          ))}
        </nav>

        {/* Celular: menu hambúrguer que desce do topo */}
        <div
          id="menu-celular"
          className={`home-gaveta${menuAberto ? " aberta" : ""}`}
          inert={menuAberto ? undefined : ""}
        >
          <div className="gaveta-usuario">
            <IconeUsuario className="gaveta-avatar" />
            <strong className="gaveta-nome">{nome}</strong>
          </div>
          <form
          className="home-busca gaveta-busca"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            emBreve("Busca");
          }}
          >
          <IconeBusca className="home-busca-icone" />
          <input type="search" placeholder="Buscar" aria-label="Buscar" />
          </form>
          <nav className="gaveta-itens" aria-label="Principal (celular)">
            {MENU.map((item) => (
              <ItemMenu key={item.id} item={{ ...item, soDesktop: false }} onEmBreve={emBreve} />
            ))}
          </nav>
          <button type="button" className="gaveta-sair" onClick={sair}>
            Sair da conta
          </button>
        </div>
      </div>
      <div
        className={`home-veu${menuAberto ? " visivel" : ""}`}
        onClick={() => setMenuAberto(false)}
        aria-hidden="true"
      />

      <main className="home-conteudo">
        <section className="home-intro">
          <div className="home-intro-texto">
            <h1>Sua jornada começa aqui.</h1>
            <p>
              A sua missão agora é <strong>{MISSAO.nome}</strong>: {MISSAO.habilidade.charAt(0).toLowerCase() + MISSAO.habilidade.slice(1)}.
            </p>
            <p>
              São {TOTAL} etapas curtas, do ponto de partida ao desafio, e o troféu fecha a missão.
              <span className="so-desktop"> Toque no nó ativo para ver a próxima etapa.</span>
            </p>
          </div>

        </section>

        {/* progresso em uma linha, logo acima da trilha */}
        <div className="home-progresso" aria-label="Seu progresso na missão">
          <span className="progresso-trilho-home" aria-hidden="true">
            <span style={{ transform: `scaleX(${Math.max(progresso, 0.02)})` }} />
          </span>
          <span className="progresso-texto">
            <b>{Math.min(etapaAtual, TOTAL)} de {TOTAL}</b> etapas concluídas.{" "}
            {concluida
              ? "Falta o fechamento no troféu."
              : `Agora: ${MISSAO.etapas[etapaAtual].tipo}.`}
          </span>
        </div>

        <section className="home-trilha" aria-label="Trilha de soft skills">
          <Trilha
            etapas={MISSAO.etapas}
            etapaAtual={etapaAtual}
            onEtapa={aoClicarEtapa}
            onTrofeu={() => setCartao("trofeu")}
          />
        </section>

        <footer className="home-rodape">© 2026 Capacitação 4.0</footer>
      </main>

      {cartao === "trofeu" && (
        <TrofeuCartao missao={MISSAO} concluida={concluida} aoFechar={fecharCartao} />
      )}
      {cartao && cartao !== "trofeu" && (
        <EtapaCartao
          key={`${cartao.indice}-${cartao.estado}`}
          missao={MISSAO}
          indice={cartao.indice}
          estado={cartao.estado}
          recusas={recusas[cartao.indice] || 0}
          aoComecar={aoComecar}
          aoRecusar={aoRecusar}
          aoFechar={fecharCartao}
        />
      )}

      <p className={`home-aviso${aviso ? " visivel" : ""}`} role="status" aria-live="polite">
        {aviso}
      </p>
    </div>
  );
}
