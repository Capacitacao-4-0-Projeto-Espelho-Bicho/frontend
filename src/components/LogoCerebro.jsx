import { useEffect, useId, useRef } from "react";
import { CEREBRO_D, CEREBRO_GRADIENTE, CEREBRO_VIEWBOX } from "./cerebroForma";

// Logo do cérebro em SVG vetorial, com uma faixa de luz que percorre o
// desenho de baixo para cima, no mesmo sentido da seta: uma vez quando a
// tela abre e de novo quando o mouse passa por cima.
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

export function LogoCerebro({ className = "", titulo, atrasoInicial = 500, ...props }) {
  const uid = useId().replace(/:/g, "");
  const animacao = useRef(null);
  const { x1, y1, x2, y2 } = CEREBRO_GRADIENTE;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => animacao.current?.beginElement?.(), atrasoInicial);
    return () => clearTimeout(t);
  }, [atrasoInicial]);

  function brilhar() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animacao.current?.beginElement?.();
  }

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
      </defs>
      <path fill={`url(#cor-${uid})`} fillRule="evenodd" d={CEREBRO_D} />
      <path className="logo-cerebro-luz" fill={`url(#luz-${uid})`} fillRule="evenodd" d={CEREBRO_D} />
    </svg>
  );
}
