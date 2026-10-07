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

// Trilha de soft skills da Home (Figma SCRUM-78). Caminho, nós e troféu
// são desenhados em SVG: nítidos em qualquer tela e cada etapa é um botão
// de verdade. Os nomes das etapas foram tirados
// dos ícones e precisam ser confirmados com o João / com o conteúdo.
export const ETAPAS = [
  { id: "inicio", rotulo: "Primeiros passos", Ilustracao: null },
  { id: "comunicacao", rotulo: "Comunicação", Ilustracao: IlustraComunicacao },
  { id: "equipe", rotulo: "Trabalho em equipe", Ilustracao: IlustraEquipe },
  { id: "criatividade", rotulo: "Criatividade", Ilustracao: IlustraCriatividade },
  { id: "problemas", rotulo: "Resolução de problemas", Ilustracao: IlustraProblemas },
  { id: "colaboracao", rotulo: "Colaboração", Ilustracao: IlustraColaboracao },
  { id: "organizacao", rotulo: "Organização", Ilustracao: IlustraOrganizacao },
];

// Posições (centro de cada nó) no sistema de coordenadas de cada layout.
// Desktop segue o Figma (1728 x 415); celular é a trilha em zigue-zague vertical.
const LAYOUTS = {
  desktop: {
    w: 1728,
    h: 415,
    no: 108,
    trofeu: { x: 1326, y: 168, w: 168 },
    pontos: [
      [374, 208], [480, 312], [595, 222], [687, 106], [835, 166], [966, 260], [1116, 208],
    ],
    fimCaminho: [1262, 190],
  },
  mobile: {
    w: 360,
    h: 640,
    no: 84,
    trofeu: { x: 180, y: 78, w: 118 },
    pontos: [
      [180, 572], [262, 504], [172, 436], [92, 368], [170, 300], [262, 232], [180, 164],
    ],
    fimCaminho: [180, 120],
  },
};

// Curva suave passando pelos pontos (Catmull-Rom convertida em Bézier).
function curva(pts) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
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

export function Trilha({ etapaAtual = 0, onEtapa, onTrofeu }) {
  const nome = useLayout();
  const L = LAYOUTS[nome];
  // o caminho passa um pouco abaixo do centro dos nós, como na ilustração
  const desloc = nome === "desktop" ? 14 : 10;
  const pts = useMemo(
    () => [...L.pontos.map(([x, y]) => [x, y + desloc]), L.fimCaminho],
    [L, desloc]
  );
  const caminho = useMemo(() => curva(pts), [pts]);
  const feito = useMemo(() => curva(pts.slice(0, etapaAtual + 2)), [pts, etapaAtual]);
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
        {ETAPAS.map((etapa, i) => {
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
                aria-label={`${etapa.rotulo}${estado === "bloqueada" ? " (bloqueada)" : estado === "atual" ? " (etapa atual)" : ""}`}
              >
                {estado === "atual" && <span className="etapa-pulso" aria-hidden="true" />}
                <DiscoNo id={etapa.id} Ilustracao={etapa.Ilustracao} atual={estado === "atual"} />
              </button>
              <span className="etapa-dica" aria-hidden="true">
                {etapa.rotulo}
                {estado === "bloqueada" && <small>Bloqueada</small>}
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
        <button type="button" className="trofeu-botao" onClick={clicarTrofeu} aria-label="Troféu da trilha">
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
