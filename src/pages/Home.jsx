import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import cerebro from "../assets/cerebro.webp";
import avatar from "../assets/home/avatar.png";
import trilhaDesktop from "../assets/home/trilha-desktop.webp";
import trilhaMobile from "../assets/home/trilha-mobile.webp";
import iconeAtividades from "../assets/home/icone-atividades.png";
import iconeNotificacoes from "../assets/home/icone-notificacoes.png";
import iconeHome from "../assets/home/icone-home.png";
import iconeHistorico from "../assets/home/icone-historico.png";
import iconeConfiguracoes from "../assets/home/icone-configuracoes.png";
import iconeBusca from "../assets/home/icone-busca.png";
import "../styles/home.css";

// Home conforme o Figma "HOME PAGE" (SCRUM-78): versão 1 no desktop
// (trilha na horizontal) e versão 1 do mobile (trilha na vertical).
// O backend ainda não tem rotas de atividades, notificações, histórico,
// configurações nem busca; esses itens avisam "em breve" em vez de navegar.

const MENU = [
  { id: "atividades", rotulo: "Atividades", icone: iconeAtividades },
  { id: "notificacoes", rotulo: "Notificações", icone: iconeNotificacoes, soDesktop: true },
  { id: "home", rotulo: "Home", icone: iconeHome, atual: true },
  { id: "historico", rotulo: "Histórico", icone: iconeHistorico },
  { id: "configuracoes", rotulo: "Configurações", icone: iconeConfiguracoes },
];

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
  const timer = useRef();

  function avisar(texto) {
    setAviso(texto);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAviso(""), 2600);
  }
  useEffect(() => () => clearTimeout(timer.current), []);

  const emBreve = (rotulo) => avisar(`${rotulo}: em breve.`);

  return (
    <div className="home">
      <header className="home-topo">
        <div className="home-usuario">
          <img className="home-avatar" src={avatar} alt="" />
          <div className="home-usuario-texto">
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

      <main className="home-conteudo">
        <section className="home-intro">
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
        </section>

        <section className="home-trilha" aria-label="Trilha de soft skills">
          <div className="trilha-quadro">
            <picture>
              <source media="(max-width: 860px)" srcSet={trilhaMobile} />
              <img
                className="trilha-imagem"
                src={trilhaDesktop}
                alt="Trilha com seis etapas de soft skills, do ponto de partida até o troféu"
              />
            </picture>
            {/* área clicável sobre o nó "Começar" da ilustração */}
            <button
              type="button"
              className="trilha-no-ativo"
              aria-label="Começar a primeira atividade"
              onClick={() => avisar("A primeira atividade ainda não está disponível.")}
            >
              <span className="trilha-pulso" aria-hidden="true" />
            </button>
          </div>
        </section>
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
