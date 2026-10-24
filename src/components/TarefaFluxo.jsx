import { useEffect, useRef, useState } from "react";
import { Trilha, ilustracaoDe } from "./Trilha";
import { Escala, Opcoes } from "./EtapaCartao";
import { DiscoNo } from "./IconesHome";
import { TEMPOS_DIA } from "../data/missaoDemo";
import { medirTempo, registrarEvento } from "../services/rastreio";

// Tela de tarefa (design do João, SCRUM-88; implementação SCRUM-89).
// Abre quando a pessoa começa uma etapa da trilha. Na primeira vez mostra
// antes duas telas de explicação: o que a missão treina e como a trilha
// funciona. Depois vêm a etapa em si e a autoavaliação de 1 a 5 (como se
// saiu e quanto foi difícil), que é o feedback objetivo pedido na reunião
// de 14/10. Ponto de partida e reflexão já são respostas, então não pedem
// a autoavaliação extra.

const PASSOS_INTRO = ["apresentacao", "funciona"];

function Disco({ etapa, indice }) {
  const Ilustracao = ilustracaoDe(etapa, indice);
  return (
    <div className="tarefa-disco" aria-hidden="true">
      <DiscoNo id={`tarefa-${etapa.id}`} Ilustracao={Ilustracao} atual />
    </div>
  );
}

function Pontos({ total, atual }) {
  return (
    <ol className="tarefa-pontos" aria-label={`Passo ${atual + 1} de ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <li key={i} className={i < atual ? "feito" : i === atual ? "atual" : ""} aria-hidden="true" />
      ))}
    </ol>
  );
}

export function TarefaFluxo({ missao, indice, reduzida = false, mostrarIntro, aoIntroVista, aoConcluir, aoNaoPosso, aoSair }) {
  const etapa = missao.etapas[indice];
  const total = missao.etapas.length;
  const precisaAvaliar = !etapa.escalas && !etapa.acoes;
  // a lista de passos é decidida ao abrir e não muda no meio do fluxo
  const [passos] = useState(() => [
    ...(mostrarIntro ? PASSOS_INTRO : []),
    "etapa",
    ...(precisaAvaliar ? ["avaliacao"] : []),
  ]);
  const [passo, setPasso] = useState(0);
  const tela = passos[passo];
  const titulo = useRef(null);

  // respostas
  const [escalas, setEscalas] = useState({});
  const [tempo, setTempo] = useState("");
  const [acao, setAcao] = useState("");
  const [saiu, setSaiu] = useState(0);
  const [dificuldade, setDificuldade] = useState(0);

  useEffect(() => medirTempo("tarefa_aberta", { etapa: etapa.id }), [etapa.id]);

  // a cada passo: volta ao topo e leva o foco para o título (leitor de tela
  // anuncia a tela nova; quem usa teclado continua dali)
  useEffect(() => {
    window.scrollTo({ top: 0 });
    titulo.current?.focus({ preventScroll: true });
    registrarEvento("tarefa_passo", { etapa: etapa.id, tela });
  }, [tela, etapa.id]);

  useEffect(() => {
    const aoTeclar = (e) => e.key === "Escape" && aoSair();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aoSair]);

  function avancar() {
    if (PASSOS_INTRO.includes(tela) && passos[passo + 1] === "etapa") aoIntroVista();
    setPasso((p) => p + 1);
  }

  function voltar() {
    if (passo === 0) return aoSair();
    setPasso((p) => p - 1);
  }

  function concluir(extra = {}) {
    const dados = { reduzida, escalas, tempo, acao, saiu, dificuldade, ...extra };
    registrarEvento("etapa_concluida", { etapa: etapa.id, ...dados });
    aoConcluir(dados);
  }

  let conteudo;
  if (tela === "apresentacao") {
    conteudo = (
      <div className="tarefa-grade">
        <div className="tarefa-texto">
          <p className="tarefa-sobre">Missão: {missao.nome}</p>
          <h1 ref={titulo} tabIndex={-1}>
            Esta missão treina {missao.competencia.toLowerCase()}
          </h1>
          <p>{missao.habilidade}.</p>
          <p>
            Ela foi dividida em {total} etapas curtas para você praticar aos poucos, cerca de{" "}
            {missao.duracaoTotal.replace("cerca de ", "")} no total:
          </p>
          <ol className="tarefa-etapas">
            {missao.etapas.map((e, i) => (
              <li key={e.id} className={i === indice ? "atual" : ""}>
                <span className="tarefa-etapa-tipo">{e.tipo}</span>
                <span>{e.titulo}</span>
                <span className="tarefa-etapa-min">{e.duracao} min</span>
              </li>
            ))}
          </ol>
        </div>
        <Disco etapa={missao.etapas[0]} indice={0} />
      </div>
    );
  } else if (tela === "funciona") {
    conteudo = (
      <div className="tarefa-texto tarefa-texto-largo">
        <p className="tarefa-sobre">Como funciona</p>
        <h1 ref={titulo} tabIndex={-1}>
          Cada etapa é um passo na sua trilha até o troféu
        </h1>
        <div className="tarefa-previa">
          <Trilha etapas={missao.etapas} etapaAtual={indice} previa />
        </div>
        <p>
          Ao terminar cada etapa, você avalia de 1 a 5 como se saiu e quanto ela foi difícil. Não
          precisa escrever nada nem enviar arquivo.
        </p>
        <div className="tarefa-escala-exemplo" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={n === 4 ? "marcado" : ""}>
              {n}
            </span>
          ))}
        </div>
      </div>
    );
  } else if (tela === "etapa") {
    const pode = etapa.escalas ? etapa.escalas.every((e) => escalas[e.id]) && tempo : etapa.acoes ? acao : true;
    conteudo = (
      <div className="tarefa-grade">
        <div className="tarefa-texto">
          <p className="tarefa-sobre">
            Etapa {indice + 1} de {total}: {etapa.tipo} · {reduzida ? etapa.reduzida.duracao : etapa.duracao} minutos
          </p>
          <h1 ref={titulo} tabIndex={-1}>
            {etapa.titulo}
          </h1>
          {reduzida ? (
            <p className="cartao-aviso">Versão menor desta etapa. O objetivo continua o mesmo.</p>
          ) : (
            etapa.ajustada && <p className="cartao-aviso">{etapa.ajustada}</p>
          )}
          <p className="tarefa-atividade">{reduzida ? etapa.reduzida.atividade : etapa.atividade}</p>

          {etapa.escalas && (
            <div className="tarefa-respostas">
              {etapa.escalas.map((e) => (
                <Escala
                  key={e.id}
                  nome={e.id}
                  pergunta={e.pergunta}
                  valor={escalas[e.id]}
                  aoMudar={(n) => setEscalas((v) => ({ ...v, [e.id]: n }))}
                />
              ))}
              <Opcoes
                legenda="Quanto tempo por dia você tem para a missão?"
                nome="tempo"
                opcoes={TEMPOS_DIA}
                valor={tempo}
                aoMudar={setTempo}
              />
            </div>
          )}
          {etapa.acoes && (
            <div className="tarefa-respostas">
              <Opcoes
                legenda="Qual ação você vai tomar a partir daqui?"
                nome="acao"
                opcoes={etapa.acoes.map((rotulo, i) => ({ id: String(i), rotulo }))}
                valor={acao}
                aoMudar={setAcao}
              />
            </div>
          )}

          <div className="tarefa-acoes">
            <button
              type="button"
              className="botao-primario"
              disabled={!pode}
              onClick={() => (precisaAvaliar ? avancar() : concluir())}
            >
              {precisaAvaliar ? "Etapa concluída" : "Concluir etapa"}
            </button>
            <button type="button" className="cartao-link" onClick={aoNaoPosso}>
              Não consegui fazer agora
            </button>
          </div>
        </div>
        <Disco etapa={etapa} indice={indice} />
      </div>
    );
  } else {
    conteudo = (
      <div className="tarefa-texto">
        <p className="tarefa-sobre">
          Etapa {indice + 1} de {total}: {etapa.tipo}
        </p>
        <h1 ref={titulo} tabIndex={-1}>
          Como foi esta etapa?
        </h1>
        <div className="tarefa-respostas tarefa-avaliacao">
          <Escala
            nome="saiu"
            pergunta="Como você se saiu nesta etapa?"
            valor={saiu}
            aoMudar={setSaiu}
            pontas={["Muito mal", "Muito bem"]}
          />
          <Escala
            nome="dificuldade"
            pergunta="Quanto esta etapa foi difícil para você?"
            valor={dificuldade}
            aoMudar={setDificuldade}
            pontas={["Muito fácil", "Muito difícil"]}
          />
        </div>
        <div className="tarefa-acoes">
          <button type="button" className="botao-primario" disabled={!saiu || !dificuldade} onClick={() => concluir()}>
            Enviar avaliação
          </button>
        </div>
      </div>
    );
  }

  const ultimoIntro = PASSOS_INTRO.includes(tela);
  return (
    <section className="tarefa" aria-label={`Etapa ${indice + 1}: ${etapa.titulo}`}>
      <header className="tarefa-topo">
        <button type="button" className="tarefa-voltar" onClick={voltar}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          {passo === 0 ? "Voltar à trilha" : "Voltar"}
        </button>
        {passos.length > 1 && <Pontos total={passos.length} atual={passo} />}
      </header>

      <div className="tarefa-painel" key={tela}>
        {conteudo}
        {ultimoIntro && (
          <div className="tarefa-acoes tarefa-acoes-fim">
            <button type="button" className="botao-primario" onClick={avancar}>
              {tela === "funciona" ? "Ir para a etapa" : "Próximo"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
