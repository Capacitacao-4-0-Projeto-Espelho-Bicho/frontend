import { ilustracaoDe } from "./Trilha";
import { DiscoNo } from "./IconesHome";

// Aba "Atividades" (design do João, SCRUM-88): quanto da missão atual já foi
// feito, um botão para retomar de onde parou e as missões da pessoa.
// Hoje só existe a missão de demonstração; a próxima aparece bloqueada até
// o back-end ter as rotas de missão.

function Anel({ valor }) {
  const r = 52;
  const volta = 2 * Math.PI * r;
  return (
    <svg className="atividades-anel" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r={r} className="anel-fundo" />
      <circle
        cx="60"
        cy="60"
        r={r}
        className="anel-feito"
        strokeDasharray={volta}
        strokeDashoffset={volta * (1 - valor)}
        transform="rotate(-90 60 60)"
      />
    </svg>
  );
}

export function PainelAtividades({ missao, etapaAtual, aoRetomar, aoVerTrilha }) {
  const total = missao.etapas.length;
  const feitas = Math.min(etapaAtual, total);
  const pct = Math.round((feitas / total) * 100);
  const concluida = feitas >= total;
  const atual = missao.etapas[Math.min(etapaAtual, total - 1)];

  let frase;
  if (feitas === 0) frase = `Você ainda não começou a missão ${missao.nome}.`;
  else if (concluida) frase = `Você concluiu todas as etapas de ${missao.nome}. Falta o fechamento no troféu.`;
  else frase = `Você já concluiu ${pct}% da missão ${missao.nome}. Próxima etapa: ${atual.tipo}.`;

  return (
    <section className="atividades" aria-labelledby="atividades-titulo">
      <div className="atividades-resumo">
        <div className="atividades-anel-caixa">
          <Anel valor={feitas / total} />
          <span className="atividades-pct">{pct}%</span>
        </div>
        <div className="atividades-resumo-texto">
          <h1 id="atividades-titulo">Suas atividades</h1>
          <p>{frase}</p>
          <div className="tarefa-acoes">
            <button type="button" className="botao-primario" onClick={aoRetomar}>
              {feitas === 0 ? "Começar atividade" : concluida ? "Abrir o troféu" : "Retomar atividade"}
            </button>
            <button type="button" className="cartao-link" onClick={aoVerTrilha}>
              Ver a trilha
            </button>
          </div>
        </div>
      </div>

      <h2 className="atividades-subtitulo">Suas missões</h2>
      <ul className="atividades-lista">
        <li>
          <button type="button" className="atividade-cartao" onClick={aoRetomar}>
            <span className="atividade-competencia">{missao.competencia}</span>
            <span className="atividade-ilustra" aria-hidden="true">
              <DiscoNo id="ativ-atual" Ilustracao={ilustracaoDe(atual, etapaAtual)} atual />
            </span>
            <span className="atividade-nome">{missao.nome}</span>
            <span className="atividade-barra" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.max(feitas / total, 0.02)})` }} />
            </span>
            <span className="atividade-meta">
              {feitas} de {total} etapas · {pct}%
            </span>
          </button>
        </li>
        <li>
          <div className="atividade-cartao bloqueada" aria-disabled="true">
            <span className="atividade-competencia">{missao.proxima}</span>
            <span className="atividade-ilustra" aria-hidden="true">
              <DiscoNo id="ativ-proxima" Ilustracao={ilustracaoDe({ id: "contexto" }, 3)} />
            </span>
            <span className="atividade-nome">Próxima missão</span>
            <span className="atividade-meta">Abre depois do fechamento da missão atual</span>
          </div>
        </li>
      </ul>
    </section>
  );
}
