import { useEffect, useMemo, useState } from "react";
import {
  DiscoNo,
  Trofeu,
  IlustraComunicacao,
  IlustraEquipe,
  IlustraCriatividade,
  IlustraProblemas,
  IlustraColaboracao,
  IlustraOrganizacao,
} from "./IconesHome";

// Trilha da Home (Figma SCRUM-78). Cada nó é uma etapa da missão atual
// ("Especificação das Missões e Etapas", seção 5): sempre 6 etapas, na mesma
// ordem, e o troféu no fim é o fechamento da missão. Caminho, nós e troféu
// são SVG: nítidos em qualquer tela, e cada etapa é um botão de verdade.
const ILUSTRACOES = {
  partida: IlustraOrganizacao, // prancheta: autoavaliação
  entender: IlustraCriatividade, // lâmpada: entender a habilidade
  guiada: IlustraProblemas, // engrenagem: prática com roteiro
  contexto: IlustraEquipe, // pessoas: situação real
  desafio: IlustraColaboracao, // quebra-cabeça: o desafio
  reflexao: IlustraComunicacao, // balão: reflexão
};

// Posições (centro de cada nó) no sistema de coordenadas de cada layout.
// Desktop segue o Figma (1728 x 415); celular é a trilha em zigue-zague vertical.
const LAYOUTS = {
  desktop: {
    w: 1728,
    h: 415,
    no: 108,
    trofeu: { x: 1326, y: 168, w: 168 },
    pontos: [
      [374, 208], [500, 312], [655, 170], [820, 132], [966, 260], [1116, 208],
    ],
    fimCaminho: [1262, 190],
  },
  mobile: {
    w: 360,
    h: 640,
    no: 84,
    trofeu: { x: 180, y: 78, w: 118 },
    pontos: [
      [180, 572], [262, 490], [166, 410], [94, 330], [176, 250], [232, 176],
    ],
    fimCaminho: [180, 120],
  },
};

// Curva suave passando pelos pontos (Catmull-Rom convertida em Bézier).
// `trechos` desenha só os primeiros trechos, mas usando os pontos vizinhos
// da trilha inteira: assim o trecho verde (feito) cai exatamente em cima
// da linha escura. Cortar a lista de pontos mudava a curvatura do último trecho.
function curva(pts, trechos = pts.length - 1) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < trechos; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 4, p1[1] + (p2[1] - p0[1]) / 4];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 4, p2[1] - (p3[1] - p1[1]) / 4];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function useLayout() {
  const consulta = "(max-width: 860px)";
  const [mobile, setMobile] = useState(() => window.matchMedia(consulta).matches);
  useEffect(() => {
    const mq = window.matchMedia(consulta);
    const mudar = (e) => setMobile(e.matches);
    mq.addEventListener("change", mudar);
    return () => mq.removeEventListener("change", mudar);
  }, []);
  return mobile ? "mobile" : "desktop";
}

const pct = (v, total) => `${(v / total) * 100}%`;

export function Trilha({ etapas, etapaAtual = 0, onEtapa, onTrofeu }) {
  const nome = useLayout();
  const L = LAYOUTS[nome];
  // o caminho passa um pouco abaixo do centro dos nós, como na ilustração
  const desloc = nome === "desktop" ? 14 : 10;
  const pts = useMemo(
    () => [...L.pontos.map(([x, y]) => [x, y + desloc]), L.fimCaminho],
    [L, desloc]
  );
  const caminho = useMemo(() => curva(pts), [pts]);
  // verde: o caminho já percorrido, do primeiro nó até a etapa atual (ou até o troféu)
  const feito = useMemo(() => curva(pts, Math.min(etapaAtual, pts.length - 1)), [pts, etapaAtual]);
  const [estourou, setEstourou] = useState(false);

  function clicarTrofeu() {
    setEstourou(false);
    requestAnimationFrame(() => setEstourou(true));
    onTrofeu?.();
  }

  return (
    <div
      className={`trilha trilha-${nome}`}
      style={{ aspectRatio: `${L.w} / ${L.h}` }}
      key={nome}
    >
      <svg className="trilha-caminho" viewBox={`0 0 ${L.w} ${L.h}`} aria-hidden="true">
        <path className="caminho-sombra" d={caminho} pathLength="1" />
        <path className="caminho-base" d={caminho} pathLength="1" />
        <path className="caminho-feito" d={feito} pathLength="1" />
      </svg>

      <ol className="trilha-etapas">
        {etapas.map((etapa, i) => {
          const [x, y] = L.pontos[i];
          const estado = i < etapaAtual ? "feita" : i === etapaAtual ? "atual" : "bloqueada";
          return (
            <li
              key={etapa.id}
              className={`etapa etapa-${estado}`}
              style={{
                left: pct(x, L.w),
                top: pct(y, L.h),
                width: pct(L.no, L.w),
                "--ordem": i,
              }}
            >
              {estado === "atual" && (
                <button
                  type="button"
                  className="etapa-balao"
                  onClick={() => onEtapa?.(etapa, estado)}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <span className="balao-play" />
                  Começar
                </button>
              )}
              <button
                type="button"
                className="etapa-botao"
                onClick={() => onEtapa?.(etapa, estado)}
                aria-label={`Etapa ${i + 1} de ${etapas.length}: ${etapa.tipo}${estado === "bloqueada" ? " (bloqueada)" : estado === "atual" ? " (etapa atual)" : " (concluída)"}`}
              >
                {estado === "atual" && <span className="etapa-pulso" aria-hidden="true" />}
                <DiscoNo id={etapa.id} Ilustracao={ILUSTRACOES[etapa.id]} atual={estado === "atual"} />
              </button>
              <span className="etapa-dica" aria-hidden="true">
                {i + 1}. {etapa.tipo}
                {estado === "bloqueada" && <small>Bloqueada</small>}
                {estado === "feita" && <small>Concluída</small>}
              </span>
            </li>
          );
        })}
      </ol>

      <div
        className={`trofeu${estourou ? " estourou" : ""}`}
        style={{
          left: pct(L.trofeu.x, L.w),
          top: pct(L.trofeu.y, L.h),
          width: pct(L.trofeu.w, L.w),
        }}
        onAnimationEnd={(e) => e.animationName === "trofeu-estouro" && setEstourou(false)}
      >
        <span className="trofeu-aura" aria-hidden="true" />
        <button type="button" className="trofeu-botao" onClick={clicarTrofeu} aria-label="Troféu: fechamento da missão">
          <span className="trofeu-corpo">
            <Trofeu />
          </span>
        </button>
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`faisca faisca-${n}`} aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}
