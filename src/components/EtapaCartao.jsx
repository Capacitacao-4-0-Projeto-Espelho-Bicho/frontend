import { useEffect, useRef, useState } from "react";
import { MOTIVOS_RECUSA } from "../data/missaoDemo";

// Cartão que abre ao tocar num nó da trilha (Especificação, item 8.3).
// Mostra a etapa, a habilidade e a duração, com duas saídas:
// "Começar etapa" e "Não posso realizar agora". A recusa pede um motivo
// (lista fechada, item 9.2) e oferece a versão reduzida; uma segunda recusa
// libera a etapa seguinte, exceto na etapa 5, que é obrigatória.

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

export function EtapaCartao({ missao, indice, estado, recusas, aoComecar, aoRecusar, aoFechar }) {
  const etapa = missao.etapas[indice];
  const total = missao.etapas.length;
  const [tela, setTela] = useState(recusas > 0 && estado === "atual" ? "reduzida" : "detalhe");
  const [motivo, setMotivo] = useState("");
  const [outro, setOutro] = useState("");
  const reduzida = tela === "reduzida";
  const duracao = reduzida ? etapa.reduzida.duracao : etapa.duracao;

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

  if (tela === "recusa") {
    const pode = motivo && (motivo !== "outro" || outro.trim());
    return (
      <Moldura titulo={cabecalho} rotuloId={`etapa-${etapa.id}-rotulo`} aoFechar={aoFechar}>
        <form
          className="cartao-recusa"
          onSubmit={(e) => {
            e.preventDefault();
            if (!pode) return;
            aoRecusar({ motivo, texto: outro.trim() });
            setTela("reduzida");
          }}
        >
          <fieldset>
            <legend>O que impede você de fazer esta etapa agora?</legend>
            {MOTIVOS_RECUSA.map((m, i) => (
              <label key={m.id} className="cartao-motivo">
                <input
                  type="radio"
                  name="motivo"
                  value={m.id}
                  checked={motivo === m.id}
                  onChange={() => setMotivo(m.id)}
                  data-foco={i === 0 ? "" : undefined}
                />
                <span>{m.rotulo}</span>
              </label>
            ))}
          </fieldset>
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
      </Moldura>
    );
  }

  const bloqueada = estado === "bloqueada";
  const feita = estado === "feita";
  const segundaRecusa = reduzida && recusas >= 1;

  return (
    <Moldura titulo={cabecalho} rotuloId={`etapa-${etapa.id}-rotulo`} aoFechar={aoFechar}>
      {reduzida ? (
        <p className="cartao-aviso">
          Preparamos uma versão menor desta etapa. O objetivo continua o mesmo.
        </p>
      ) : (
        etapa.ajustada && <p className="cartao-aviso">{etapa.ajustada}</p>
      )}

      <p className="cartao-atividade">{reduzida ? etapa.reduzida.atividade : etapa.atividade}</p>
      <p className="cartao-evidencia">
        <span>O que você entrega</span>
        {etapa.evidencia}
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
            onClick={() => aoComecar({ reduzida })}
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
    </Moldura>
  );
}

// Fechamento da missão (troféu, item 7.3): a pessoa se posiciona entre os
// descritores do nível de origem e do nível-alvo.
export function TrofeuCartao({ missao, concluida, aoFechar }) {
  const [escolha, setEscolha] = useState(null);
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

  return (
    <Moldura titulo={titulo} rotuloId="trofeu-rotulo" aoFechar={aoFechar}>
      {!concluida ? (
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
      ) : escolha === null ? (
        <fieldset className="cartao-recusa">
          <legend>Releia a sua resposta do desafio. Qual frase descreve melhor você agora?</legend>
          {[missao.nivelOrigem, missao.nivelAlvo].map((n, i) => (
            <label key={n} className="cartao-motivo">
              <input
                type="radio"
                name="nivel"
                onChange={() => setEscolha(n)}
                data-foco={i === 0 ? "" : undefined}
              />
              <span>{missao.descritores[n]}</span>
            </label>
          ))}
        </fieldset>
      ) : (
        <>
          <p className="cartao-aviso">
            {escolha >= missao.nivelAlvo
              ? `Nível estimado: ${missao.nivelAlvo}. Você atingiu a meta desta missão.`
              : `Nível estimado: ${missao.nivelOrigem}. A próxima missão reforça esta habilidade em outro contexto.`}
          </p>
          <p className="cartao-atividade">
            O nível oficial é confirmado na próxima avaliação do ciclo. Próxima missão: {missao.proxima}.
          </p>
          <div className="cartao-acoes">
            <button type="button" className="botao-primario" onClick={aoFechar} data-foco="">
              Concluir missão
            </button>
          </div>
        </>
      )}
    </Moldura>
  );
}
