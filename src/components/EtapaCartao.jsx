import { useEffect, useRef, useState } from "react";
import {
  MOTIVOS_RECUSA,
  MOTIVOS_NAO_ATINGIU,
  RESULTADOS_ETAPA,
  TEMPOS_DIA,
} from "../data/missaoDemo";
import { medirTempo, registrarEvento } from "../services/rastreio";

// Cartão que abre ao tocar num nó da trilha (Especificação, item 8.3).
// Mostra a etapa, a habilidade e a duração, com duas saídas:
// "Começar etapa" e "Não posso realizar agora". A recusa pede um motivo
// (lista fechada, item 9.2) e oferece a versão reduzida; uma segunda recusa
// libera a etapa seguinte, exceto no desafio, que é obrigatório.
//
// Reunião de 14/10: o sistema não analisa texto nem gravação. Ao terminar,
// a pessoa responde só coisas objetivas: escalas de 1 a 5, "fiz / fiz em
// parte / não fiz" e uma lista curta para marcar.

function useDialogo(aoFechar) {
  const ref = useRef(null);
  useEffect(() => {
    const anterior = document.activeElement;
    ref.current?.querySelector("[data-foco]")?.focus();
    const aoTeclar = (e) => e.key === "Escape" && aoFechar();
    window.addEventListener("keydown", aoTeclar);
    return () => {
      window.removeEventListener("keydown", aoTeclar);
      anterior?.focus?.();
    };
  }, [aoFechar]);
  return ref;
}

function Moldura({ titulo, rotuloId, aoFechar, children }) {
  const ref = useDialogo(aoFechar);
  return (
    <div className="cartao-fundo" onClick={aoFechar}>
      <div
        ref={ref}
        className="cartao-etapa"
        role="dialog"
        aria-modal="true"
        aria-labelledby={rotuloId}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="cartao-fechar" onClick={aoFechar} aria-label="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {titulo}
        {children}
      </div>
    </div>
  );
}


// Escala de 1 a 5 (Likert), como botões lado a lado
function Escala({ nome, pergunta, valor, aoMudar, foco }) {
  return (
    <fieldset className="cartao-escala">
      <legend>{pergunta}</legend>
      <div className="escala-opcoes">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="escala-opcao">
            <input
              type="radio"
              name={nome}
              value={n}
              checked={valor === n}
              onChange={() => aoMudar(n)}
              data-foco={foco && n === 1 ? "" : undefined}
            />
            <span>{n}</span>
          </label>
        ))}
      </div>
      <p className="escala-pontas" aria-hidden="true">
        <span>Nada</span>
        <span>Muito</span>
      </p>
    </fieldset>
  );
}

function Opcoes({ legenda, nome, opcoes, valor, aoMudar, foco }) {
  return (
    <fieldset>
      <legend>{legenda}</legend>
      {opcoes.map((o, i) => (
        <label key={o.id} className="cartao-motivo">
          <input
            type="radio"
            name={nome}
            checked={valor === o.id}
            onChange={() => aoMudar(o.id)}
            data-foco={foco && i === 0 ? "" : undefined}
          />
          <span>{o.rotulo}</span>
        </label>
      ))}
    </fieldset>
  );
}

// O que a pessoa responde ao terminar a etapa. Depende do tipo:
// ponto de partida = escalas + tempo por dia; reflexão = escolher uma ação;
// as outras = "fiz / fiz em parte / não fiz" + lista para marcar.
function Checagem({ etapa, reduzida, aoConcluir, aoNaoFez, aoVoltar }) {
  const [escalas, setEscalas] = useState({});
  const [tempo, setTempo] = useState("");
  const [acao, setAcao] = useState("");
  const [resultado, setResultado] = useState("");
  const [marcados, setMarcados] = useState([]);

  let pode;
  let conteudo;
  if (etapa.escalas) {
    pode = etapa.escalas.every((e) => escalas[e.id]) && tempo;
    conteudo = (
      <>
        {etapa.escalas.map((e, i) => (
          <Escala
            key={e.id}
            nome={e.id}
            pergunta={e.pergunta}
            valor={escalas[e.id]}
            aoMudar={(n) => setEscalas((v) => ({ ...v, [e.id]: n }))}
            foco={i === 0}
          />
        ))}
        <Opcoes
          legenda="Quanto tempo por dia você tem para a missão?"
          nome="tempo"
          opcoes={TEMPOS_DIA}
          valor={tempo}
          aoMudar={setTempo}
        />
      </>
    );
  } else if (etapa.acoes) {
    pode = acao;
    conteudo = (
      <Opcoes
        legenda="Qual ação você vai tomar a partir daqui?"
        nome="acao"
        opcoes={etapa.acoes.map((rotulo, i) => ({ id: String(i), rotulo }))}
        valor={acao}
        aoMudar={setAcao}
        foco
      />
    );
  } else {
    pode = resultado;
    conteudo = (
      <>
        <fieldset className="cartao-resultado">
          <legend>Como foi?</legend>
          <div className="resultado-opcoes">
            {RESULTADOS_ETAPA.map((r, i) => (
              <label key={r.id} className="resultado-opcao">
                <input
                  type="radio"
                  name="resultado"
                  checked={resultado === r.id}
                  onChange={() => setResultado(r.id)}
                  data-foco={i === 0 ? "" : undefined}
                />
                <span>{r.rotulo}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {resultado && resultado !== "nao" && etapa.checklist && (
          <fieldset>
            <legend>Marque o que você conseguiu fazer</legend>
            {etapa.checklist.map((item) => (
              <label key={item} className="cartao-motivo">
                <input
                  type="checkbox"
                  checked={marcados.includes(item)}
                  onChange={(e) =>
                    setMarcados((m) => (e.target.checked ? [...m, item] : m.filter((x) => x !== item)))
                  }
                />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
        )}
      </>
    );
  }

  const naoFez = resultado === "nao";
  return (
    <form
      className="cartao-recusa"
      onSubmit={(e) => {
        e.preventDefault();
        if (!pode) return;
        if (naoFez) return aoNaoFez();
        aoConcluir({ reduzida, escalas, tempo, acao, resultado, marcados });
      }}
    >
      {conteudo}
      {naoFez && (
        <p className="cartao-nota">Tudo bem. Você pode tentar uma versão menor desta etapa.</p>
      )}
      <div className="cartao-acoes">
        <button type="submit" className="botao-primario" disabled={!pode}>
          {naoFez ? "Ver versão menor" : "Concluir etapa"}
        </button>
        <button type="button" className="cartao-link" onClick={aoVoltar}>
          Voltar
        </button>
      </div>
    </form>
  );
}

export function EtapaCartao({ missao, indice, estado, recusas, aoConcluir, aoRecusar, aoFechar }) {
  const etapa = missao.etapas[indice];
  const total = missao.etapas.length;
  const [tela, setTela] = useState(recusas > 0 && estado === "atual" ? "reduzida" : "detalhe");
  const [motivo, setMotivo] = useState("");
  const [outro, setOutro] = useState("");
  const [reduzidaEscolhida, setReduzidaEscolhida] = useState(false);
  const reduzida = tela === "reduzida" || (tela === "checagem" && reduzidaEscolhida);
  const duracao = reduzida ? etapa.reduzida.duracao : etapa.duracao;

  // ao trocar de tela dentro do cartão, o foco vai para o primeiro campo
  useEffect(() => {
    document.querySelector(".cartao-etapa [data-foco]")?.focus();
  }, [tela]);

  // feedback implícito: quanto tempo o cartão ficou aberto
  useEffect(() => medirTempo("cartao_etapa", { etapa: etapa.id, estado }), [etapa.id, estado]);

  const cabecalho = (
    <header className="cartao-topo">
      <p className="cartao-sobre" id={`etapa-${etapa.id}-rotulo`}>
        Etapa {indice + 1} de {total}: {etapa.tipo}
      </p>
      <h2 className="cartao-titulo">{etapa.titulo}</h2>
      <p className="cartao-meta">
        <span>{missao.habilidadeCurta}</span>
        <span aria-hidden="true">·</span>
        <span>{duracao} minutos</span>
      </p>
    </header>
  );
  const moldura = (filhos) => (
    <Moldura titulo={cabecalho} rotuloId={`etapa-${etapa.id}-rotulo`} aoFechar={aoFechar}>
      {filhos}
    </Moldura>
  );

  if (tela === "checagem") {
    return moldura(
      <Checagem
        key="checagem"
        etapa={etapa}
        reduzida={reduzidaEscolhida}
        aoConcluir={(dados) => {
          registrarEvento("etapa_concluida", { etapa: etapa.id, ...dados });
          aoConcluir(dados);
        }}
        aoNaoFez={() => {
          registrarEvento("etapa_nao_feita", { etapa: etapa.id });
          aoRecusar({ motivo: "nao_fez" });
          setTela("reduzida");
        }}
        aoVoltar={() => setTela(reduzidaEscolhida ? "reduzida" : "detalhe")}
      />
    );
  }

  if (tela === "recusa") {
    const pode = motivo && (motivo !== "outro" || outro.trim());
    return moldura(
      <form
        className="cartao-recusa"
        onSubmit={(e) => {
          e.preventDefault();
          if (!pode) return;
          registrarEvento("etapa_recusada", { etapa: etapa.id, motivo });
          aoRecusar({ motivo, texto: outro.trim() });
          setTela("reduzida");
        }}
      >
        <Opcoes
          legenda="O que impede você de fazer esta etapa agora?"
          nome="motivo"
          opcoes={MOTIVOS_RECUSA}
          valor={motivo}
          aoMudar={setMotivo}
          foco
        />
        {motivo === "outro" && (
          <textarea
            className="cartao-outro"
            rows={3}
            placeholder="Conte em poucas palavras (opcional para a equipe analisar)"
            value={outro}
            onChange={(e) => setOutro(e.target.value)}
            aria-label="Outro motivo"
          />
        )}
        <div className="cartao-acoes">
          <button type="submit" className="botao-primario" disabled={!pode}>
            Enviar motivo
          </button>
          <button type="button" className="cartao-link" onClick={() => setTela("detalhe")}>
            Voltar
          </button>
        </div>
      </form>
    );
  }

  const bloqueada = estado === "bloqueada";
  const feita = estado === "feita";
  const segundaRecusa = reduzida && recusas >= 1;

  return moldura(
    <>
      {reduzida ? (
        <p className="cartao-aviso">
          Preparamos uma versão menor desta etapa. O objetivo continua o mesmo.
        </p>
      ) : (
        etapa.ajustada && <p className="cartao-aviso">{etapa.ajustada}</p>
      )}

      <p className="cartao-atividade">{reduzida ? etapa.reduzida.atividade : etapa.atividade}</p>
      <p className="cartao-evidencia">
        <span>Ao terminar</span>
        {etapa.escalas
          ? "Você responde duas escalas de 1 a 5 e o seu tempo disponível."
          : etapa.acoes
            ? "Você escolhe uma ação numa lista."
            : "Você marca o que conseguiu fazer. Não precisa enviar texto nem gravação."}
      </p>

      {bloqueada && (
        <p className="cartao-estado">Conclua a etapa {indice} para desbloquear esta.</p>
      )}
      {feita && <p className="cartao-estado feita">Etapa concluída.</p>}

      {estado === "atual" && (
        <div className="cartao-acoes">
          <button
            type="button"
            className="botao-primario"
            onClick={() => {
              setReduzidaEscolhida(reduzida);
              registrarEvento("etapa_comecada", { etapa: etapa.id, reduzida });
              setTela("checagem");
            }}
            data-foco=""
          >
            {reduzida ? "Começar versão reduzida" : "Começar etapa"}
          </button>
          {!reduzida && (
            <button type="button" className="cartao-link" onClick={() => setTela("recusa")}>
              Não posso realizar agora
            </button>
          )}
          {segundaRecusa && !etapa.obrigatoria && (
            <button type="button" className="cartao-link" onClick={() => aoRecusar({ pular: true })}>
              Pular esta etapa por agora
            </button>
          )}
        </div>
      )}
      {segundaRecusa && etapa.obrigatoria && (
        <p className="cartao-nota">
          Esta é a etapa principal da missão: sem ela o troféu não consegue atualizar o seu nível.
        </p>
      )}
      {estado !== "atual" && (
        <div className="cartao-acoes">
          <button type="button" className="botao-secundario" onClick={aoFechar} data-foco="">
            Fechar
          </button>
        </div>
      )}
    </>
  );
}

// Fechamento da missão (troféu, item 7.3): a pessoa se posiciona entre os
// descritores do nível de origem e do nível-alvo. Se não atingiu, diz o que
// pesou e escolhe refazer no mesmo contexto ou em outro (reunião de 14/10).
export function TrofeuCartao({ missao, concluida, aoRefazer, aoFechar }) {
  const [escolha, setEscolha] = useState(null);
  const [motivo, setMotivo] = useState("");
  const titulo = (
    <header className="cartao-topo">
      <p className="cartao-sobre" id="trofeu-rotulo">
        Fechamento da missão
      </p>
      <h2 className="cartao-titulo">{missao.nome}</h2>
      <p className="cartao-meta">
        <span>{missao.habilidadeCurta}</span>
        <span aria-hidden="true">·</span>
        <span>
          Nível {missao.nivelOrigem} para {missao.nivelAlvo}
        </span>
      </p>
    </header>
  );

  let conteudo;
  if (!concluida) {
    conteudo = (
      <>
        <p className="cartao-atividade">
          Conclua as {missao.etapas.length} etapas para abrir o fechamento. Nele você relê o seu desafio,
          compara com o ponto de partida e o seu nível é atualizado.
        </p>
        <div className="cartao-acoes">
          <button type="button" className="botao-secundario" onClick={aoFechar} data-foco="">
            Fechar
          </button>
        </div>
      </>
    );
  } else if (escolha === null) {
    conteudo = (
      <fieldset className="cartao-recusa">
        <legend>Pense no seu desafio. Qual frase descreve melhor você agora?</legend>
        {[missao.nivelOrigem, missao.nivelAlvo].map((n, i) => (
          <label key={n} className="cartao-motivo">
            <input
              type="radio"
              name="nivel"
              onChange={() => {
                registrarEvento("trofeu_autoavaliacao", { nivel: n });
                setEscolha(n);
              }}
              data-foco={i === 0 ? "" : undefined}
            />
            <span>{missao.descritores[n]}</span>
          </label>
        ))}
      </fieldset>
    );
  } else if (escolha >= missao.nivelAlvo) {
    conteudo = (
      <>
        <p className="cartao-aviso">Nível estimado: {missao.nivelAlvo}. Você atingiu a meta desta missão.</p>
        <p className="cartao-atividade">
          O nível oficial é confirmado na próxima avaliação do ciclo. Próxima missão: {missao.proxima}.
        </p>
        <div className="cartao-acoes">
          <button type="button" className="botao-primario" onClick={aoFechar} data-foco="">
            Concluir missão
          </button>
        </div>
      </>
    );
  } else {
    conteudo = (
      <div className="cartao-recusa">
        <p className="cartao-aviso">
          Nível estimado: {missao.nivelOrigem}. Isso acontece, e refazer a missão costuma funcionar.
        </p>
        <Opcoes
          legenda="O que mais pesou nesta missão?"
          nome="nao-atingiu"
          opcoes={MOTIVOS_NAO_ATINGIU}
          valor={motivo}
          aoMudar={setMotivo}
          foco
        />
        <div className="cartao-acoes">
          <button
            type="button"
            className="botao-primario"
            disabled={!motivo}
            onClick={() => aoRefazer({ contexto: motivo === "contexto" ? "outro" : "mesmo", motivo })}
          >
            {motivo === "contexto" ? "Refazer em outro contexto" : "Refazer a missão"}
          </button>
          {motivo && (
            <button
              type="button"
              className="cartao-link"
              onClick={() => aoRefazer({ contexto: motivo === "contexto" ? "mesmo" : "outro", motivo })}
            >
              {motivo === "contexto" ? "Prefiro o mesmo contexto" : "Refazer em outro contexto"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Moldura titulo={titulo} rotuloId="trofeu-rotulo" aoFechar={aoFechar}>
      {conteudo}
    </Moldura>
  );
}

// Lembretes (sino): frases curtas e genéricas, que a pessoa contextualiza
// sozinha. A quantidade por semana segue o tempo que ela informou.
export function LembretesCartao({ lembretes, porSemana, aoAbrir, aoFechar }) {
  const titulo = (
    <header className="cartao-topo">
      <p className="cartao-sobre" id="lembretes-rotulo">
        Notificações
      </p>
      <h2 className="cartao-titulo">Lembretes da missão</h2>
    </header>
  );
  return (
    <Moldura titulo={titulo} rotuloId="lembretes-rotulo" aoFechar={aoFechar}>
      {lembretes.length === 0 ? (
        <p className="cartao-atividade">Nenhum lembrete agora.</p>
      ) : (
        <ul className="lembretes-lista">
          {lembretes.map((l, i) => (
            <li key={l.id}>
              <p>{l.texto}</p>
              {l.acao && (
                <button
                  type="button"
                  className="cartao-link"
                  onClick={() => aoAbrir(l)}
                  data-foco={i === 0 ? "" : undefined}
                >
                  {l.acao}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="cartao-nota">
        {porSemana
          ? `Com o tempo que você informou, você recebe até ${porSemana} lembretes por semana.`
          : "Quando você responder o ponto de partida, ajustamos quantos lembretes você recebe."}
      </p>
    </Moldura>
  );
}
