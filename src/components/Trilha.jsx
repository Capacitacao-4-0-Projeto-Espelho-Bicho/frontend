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
// ("Especificação das Missões e Etapas", seção 5), em ordem, e o troféu no fim é o fechamento da missão. Caminho, nós e troféu
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

const ILUSTRACOES_EM_ORDEM = Object.values(ILUSTRACOES);
export const ilustracaoDe = (etapa, i) => ILUSTRACOES[etapa.id] || ILUSTRACOES_EM_ORDEM[i % ILUSTRACOES_EM_ORDEM.length];

// Ponto da curva de Bézier cúbica em t
function bezier(p1, c1, c2, p2, t) {
  const u = 1 - t;
  return [0, 1].map(
    (k) => u * u * u * p1[k] + 3 * u * u * t * c1[k] + 3 * u * t * t * c2[k] + t * t * t * p2[k]
  );
}

// Os pontos dos layouts foram desenhados para 6 etapas. Com outra quantidade
// (a reunião de 14/10 pediu menos etapas), os nós são redistribuídos em
// distâncias iguais ao longo da mesma curva, então o desenho não muda.
function distribuir(pts, n) {
  if (n === pts.length || n < 1) return pts;
  if (n === 1) return [pts[0]];
  const denso = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 4, p1[1] + (p2[1] - p0[1]) / 4];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 4, p2[1] - (p3[1] - p1[1]) / 4];
    for (let k = 1; k <= 40; k++) denso.push(bezier(p1, c1, c2, p2, k / 40));
  }
  const acumulado = [0];
  for (let i = 1; i < denso.length; i++) {
    acumulado.push(acumulado[i - 1] + Math.hypot(denso[i][0] - denso[i - 1][0], denso[i][1] - denso[i - 1][1]));
  }
  const total = acumulado[acumulado.length - 1];
  const saida = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const alvo = (total * k) / (n - 1);
    while (j < acumulado.length - 1 && acumulado[j + 1] < alvo) j++;
    saida.push(denso[j].map(Math.round));
  }
  return saida;
}

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

// `previa`: versão só para olhar (tela "Como funciona"), sem cliques, com
// "Você está aqui" no nó atual e "Destino" no troféu (design do João, SCRUM-88)
export function Trilha({ etapas, etapaAtual = 0, onEtapa, onTrofeu, previa = false }) {
  const nome = useLayout();
  const L = LAYOUTS[nome];
  const nos = useMemo(() => distribuir(L.pontos, etapas.length), [L, etapas.length]);
  // o caminho passa um pouco abaixo do centro dos nós, como na ilustração
  const desloc = nome === "desktop" ? 14 : 10;
  const pts = useMemo(
    () => [...nos.map(([x, y]) => [x, y + desloc]), L.fimCaminho],
    [nos, L, desloc]
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
      className={`trilha trilha-${nome}${previa ? " trilha-previa" : ""}`}
      style={{ aspectRatio: `${L.w} / ${L.h}` }}
      key={nome}
      inert={previa ? "" : undefined}
      aria-hidden={previa ? "true" : undefined}
    >
      <svg className="trilha-caminho" viewBox={`0 0 ${L.w} ${L.h}`} aria-hidden="true">
        <path className="caminho-sombra" d={caminho} pathLength="1" />
        <path className="caminho-base" d={caminho} pathLength="1" />
        <path className="caminho-feito" d={feito} pathLength="1" />
      </svg>

      <ol className="trilha-etapas">
        {etapas.map((etapa, i) => {
          const [x, y] = nos[i];
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
                  {previa ? (
                    "Você está aqui"
                  ) : (
                    <>
                      <span className="balao-play" />
                      Começar
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                className="etapa-botao"
                onClick={() => onEtapa?.(etapa, estado)}
                aria-label={`Etapa ${i + 1} de ${etapas.length}: ${etapa.tipo}${estado === "bloqueada" ? " (bloqueada)" : estado === "atual" ? " (etapa atual)" : " (concluída)"}`}
              >
                {estado === "atual" && <span className="etapa-pulso" aria-hidden="true" />}
                <DiscoNo id={etapa.id} Ilustracao={ilustracaoDe(etapa, i)} atual={estado === "atual"} />
              </button>
              {/* dica do hover (computador): o que é a etapa antes de clicar */}
              <span className="etapa-dica" aria-hidden="true">
                <span className="dica-tipo">
                  {i + 1}. {etapa.tipo}
                </span>
                {etapa.titulo && <span className="dica-titulo">{etapa.titulo}</span>}
                <small>
                  {estado === "bloqueada" ? "Bloqueada · " : estado === "feita" ? "Concluída · " : ""}
                  {etapa.duracao} min
                </small>
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
        {previa && <span className="trofeu-rotulo">Destino</span>}
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
