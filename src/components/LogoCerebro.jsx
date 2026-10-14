import { useEffect, useId, useRef } from "react";
import { CEREBRO_D, CEREBRO_GRADIENTE, CEREBRO_VIEWBOX } from "./cerebroForma";

// Logo do cérebro em SVG vetorial, com uma faixa de luz que percorre o
// desenho de baixo para cima, no mesmo sentido da seta: uma vez quando a
// tela abre e de novo quando o mouse passa por cima. Com `vivo`, o efeito
// se repete sozinho: o cérebro flutua devagar e a pessoa levanta o braço.
// As cores são as do cérebro que já usamos no céu noturno (um pouco mais
// claras que as do arquivo oficial, para não sumir no fundo escuro).
const CORES = [
  [0, "#345868"],
  [0.125, "#406b79"],
  [0.25, "#699497"],
  [0.375, "#9cb09b"],
  [0.5, "#cec48e"],
  [0.625, "#e4be72"],
  [0.75, "#e4a156"],
  [0.875, "#e88d47"],
  [1, "#ed8a40"],
];

// Região do braço com a seta (coordenadas do viewBox). Ela passa pelo vão
// entre o braço e a linha do corpo, então o braço pode girar no ombro sem
// encostar no resto do desenho.
const BRACO =
  "M645 0 L645 322 L660 330 L700 305 L760 258 L800 217 L840 165 L858 140 L866 128 L882 132 L888 142 L992 142 L992 0 Z";
// o resto começa 20 unidades depois do ombro: as duas partes se sobrepõem
// ali e não aparece a emenda quando o braço gira
const RESTO = `M0 0 H992 V935 H0 Z ${BRACO.replace("M645 0 L645 322 L660 330", "M665 0 L665 328")}`;

// a cada CICLO a luz sobe pelo desenho e, quando chega na seta, a pessoa
// levanta o braço (keyframes logo-braco em global.css, com a mesma duração)
const CICLO = 7000;

export function LogoCerebro({ className = "", titulo, atrasoInicial = 500, vivo = false, ...props }) {
  const uid = useId().replace(/:/g, "");
  const animacao = useRef(null);
  const { x1, y1, x2, y2 } = CEREBRO_GRADIENTE;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let intervalo;
    const t = setTimeout(() => {
      animacao.current?.beginElement?.();
      if (vivo) intervalo = setInterval(() => animacao.current?.beginElement?.(), CICLO);
    }, atrasoInicial);
    return () => {
      clearTimeout(t);
      clearInterval(intervalo);
    };
  }, [atrasoInicial, vivo]);

  function brilhar() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animacao.current?.beginElement?.();
  }

  const pintura = (
    <>
      <path fill={`url(#cor-${uid})`} fillRule="evenodd" d={CEREBRO_D} />
      <path className="logo-cerebro-luz" fill={`url(#luz-${uid})`} fillRule="evenodd" d={CEREBRO_D} />
    </>
  );

  return (
    <svg
      className={`logo-cerebro ${className}`}
      viewBox={CEREBRO_VIEWBOX}
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : "true"}
      onMouseEnter={brilhar}
      {...props}
    >
      <defs>
        <linearGradient id={`cor-${uid}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
          {CORES.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        {/* a faixa de luz: transparente, branca no meio, transparente */}
        <linearGradient
          id={`luz-${uid}`}
          gradientUnits="userSpaceOnUse"
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          gradientTransform={`translate(${x1 - x2} ${y1 - y2})`}
        >
          <stop offset="0.38" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="0" />
          <animateTransform
            ref={animacao}
            attributeName="gradientTransform"
            type="translate"
            from={`${x1 - x2} ${y1 - y2}`}
            to={`${x2 - x1} ${y2 - y1}`}
            dur="1.1s"
            begin="indefinite"
            fill="freeze"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.4 0 0.2 1"
          />
        </linearGradient>
        {vivo && (
          <>
            <clipPath id={`braco-${uid}`}>
              <path d={BRACO} />
            </clipPath>
            <clipPath id={`resto-${uid}`}>
              <path d={RESTO} clipRule="evenodd" />
            </clipPath>
          </>
        )}
      </defs>
      {vivo ? (
        <g className="logo-flutua">
          <g clipPath={`url(#resto-${uid})`}>{pintura}</g>
          <g className="logo-braco" style={{ animationDelay: `${atrasoInicial + 600}ms` }}>
            <g clipPath={`url(#braco-${uid})`}>{pintura}</g>
          </g>
        </g>
      ) : (
        pintura
      )}
    </svg>
  );
}
