import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Trilha, ETAPAS } from "../components/Trilha";
import cerebro from "../assets/cerebro.webp";
import avatar from "../assets/home/avatar.png";
import iconeAtividades from "../assets/home/icone-atividades.png";
import iconeNotificacoes from "../assets/home/icone-notificacoes.png";
import iconeHome from "../assets/home/icone-home.png";
import iconeHistorico from "../assets/home/icone-historico.png";
import iconeConfiguracoes from "../assets/home/icone-configuracoes.png";
import iconeBusca from "../assets/home/icone-busca.png";
import "../styles/home.css";

// Home conforme o Figma "HOME PAGE" (SCRUM-78).
// O backend ainda não tem rotas de atividades, notificações, histórico,
// configurações, busca nem progresso; esses itens avisam "em breve" e a
// trilha começa sempre na primeira etapa.

const MENU = [
  { id: "atividades", rotulo: "Atividades", icone: iconeAtividades },
  { id: "notificacoes", rotulo: "Notificações", icone: iconeNotificacoes, soDesktop: true },
  { id: "home", rotulo: "Home", icone: iconeHome, atual: true },
  { id: "historico", rotulo: "Histórico", icone: iconeHistorico },
  { id: "configuracoes", rotulo: "Configurações", icone: iconeConfiguracoes },
];

const ETAPA_ATUAL = 0; // sem rota de progresso ainda
const TOTAL = ETAPAS.length - 1; // a primeira é o ponto de partida

function ItemMenu({ item, onEmBreve }) {
  return (
    <button
      type="button"
      className={`home-menu-item${item.atual ? " atual" : ""}${item.soDesktop ? " so-desktop" : ""}`}
      aria-current={item.atual ? "page" : undefined}
      onClick={item.atual ? undefined : () => onEmBreve(item.rotulo)}
    >
      <img src={item.icone} alt="" />
      <span>{item.rotulo}</span>
    </button>
  );
}

export default function Home() {
  const { nome, sair } = useAuth();
  const [aviso, setAviso] = useState("");
  const [rolou, setRolou] = useState(false);
  const timer = useRef();

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

  const emBreve = (rotulo) => avisar(`${rotulo}: em breve.`);

  function aoClicarEtapa(etapa, estado) {
    if (estado === "atual") avisar("A primeira atividade ainda não está disponível.");
    else if (estado === "bloqueada") avisar(`${etapa.rotulo}: conclua a etapa anterior para desbloquear.`);
  }

  const proxima = ETAPAS[ETAPA_ATUAL + 1];
  const progresso = ETAPA_ATUAL / TOTAL;

  return (
    <div className="home">
      <div className={`home-cabecalho${rolou ? " rolou" : ""}`}>
        <header className="home-topo">
          <div className="home-usuario">
            <img className="home-avatar" src={avatar} alt="" />
            <div className="home-usuario-texto">
              <span className="home-ola">Olá,</span>
              <span className="home-nome">{nome}</span>
              <button type="button" className="home-sair" onClick={sair}>
                Sair
              </button>
            </div>
            <button
              type="button"
              className="home-sino so-mobile"
              aria-label="Notificações"
              onClick={() => emBreve("Notificações")}
            >
              <img src={iconeNotificacoes} alt="" />
            </button>
          </div>

          <div className="home-logo">
            <img src={cerebro} alt="Capacitação 4.0" />
          </div>

          <form
            className="home-busca"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              emBreve("Busca");
            }}
          >
            <img src={iconeBusca} alt="" />
            <input type="search" placeholder="BUSCAR" aria-label="Buscar" />
          </form>
        </header>

        <nav className="home-menu" aria-label="Principal">
          {MENU.map((item) => (
            <ItemMenu key={item.id} item={item} onEmBreve={emBreve} />
          ))}
        </nav>
      </div>

      <main className="home-conteudo">
        <section className="home-intro">
          <div className="home-intro-texto">
            <h1>Sua jornada começa aqui.</h1>
            <p>
              Explore a sua trilha de soft skills no seu próprio ritmo.
              <span className="so-desktop">
                {" "}
                Cada nó representa um passo essencial no aprimoramento de habilidades como
                comunicação, empatia, liderança e resolução de problemas.
              </span>
            </p>
            <p>
              Complete os desafios, acompanhe o seu progresso e desbloqueie os próximos níveis do
              seu perfil profissional.
              <span className="so-desktop"> Clique no nó ativo para começar a sua primeira atividade!</span>
            </p>
          </div>

          <aside className="home-progresso" aria-label="Seu progresso">
            <span className="progresso-rotulo">Seu progresso</span>
            <strong className="progresso-numero">
              {ETAPA_ATUAL} <span>de {TOTAL} etapas</span>
            </strong>
            <span className="progresso-trilho-home" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.max(progresso, 0.02)})` }} />
            </span>
            <span className="progresso-proxima">
              Próxima etapa: <b>{proxima.rotulo}</b>
            </span>
          </aside>
        </section>

        <section className="home-trilha" aria-label="Trilha de soft skills">
          <Trilha
            etapaAtual={ETAPA_ATUAL}
            onEtapa={aoClicarEtapa}
            onTrofeu={() => avisar(`Conclua as ${TOTAL} etapas para conquistar o troféu!`)}
          />
        </section>

        <footer className="home-rodape">© 2026 Capacitação 4.0</footer>
      </main>

      <nav className="home-barra-inferior" aria-label="Principal (celular)">
        {MENU.filter((i) => !i.soDesktop)
          .sort((a, b) => (a.atual ? -1 : b.atual ? 1 : 0))
          .map((item) => (
            <ItemMenu key={item.id} item={item} onEmBreve={emBreve} />
          ))}
      </nav>

      <p className={`home-aviso${aviso ? " visivel" : ""}`} role="status" aria-live="polite">
        {aviso}
      </p>
    </div>
  );
}
