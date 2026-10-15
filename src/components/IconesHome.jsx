// Ícones da Home em SVG (nítidos em qualquer tamanho e densidade de tela).
// Redesenhados a partir do Figma "HOME PAGE": traço fino preto no menu e
// ilustrações chapadas nos nós da trilha.

const traco = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/* ---------------- Menu ---------------- */

export function IconeAtividades(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...traco}>
        <circle cx="17.5" cy="5.5" r="2.5" />
        <path d="M16.5 9.5 13 17l4 3 1.5 7" />
        <path d="M16.5 9.5l3.5 4 4 1.5" />
        <path d="M13 17l-3 4-3 6" />
        <path d="M11.5 10.5 9 17" />
        <path d="M9.5 9.5l3-1 1.5 1-2.5 7-3-1z" />
        <path d="M24 12v16" />
        <path d="M3 29h26" />
      </g>
    </svg>
  );
}

export function IconeNotificacoes(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...traco}>
        <path d="M16 4.5c-4.4 0-8 3.6-8 8v6.2L5.5 23h21L24 18.7v-6.2c0-4.4-3.6-8-8-8z" />
        <path d="M13 26.5a3 3 0 0 0 6 0" />
        <path d="M16 2.5v2" />
      </g>
    </svg>
  );
}

export function IconeHome(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...traco}>
        <path d="M4 15 16 4.5 28 15" />
        <path d="M7.5 12.5V27.5h17V12.5" />
        <path d="M13 27.5v-8h6v8" />
      </g>
    </svg>
  );
}

export function IconeHistorico(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...traco}>
        <path d="M8 3.5h11l6 6v19H8z" />
        <path d="M19 3.5v6h6" />
        <path d="M12 15h9M12 19h9M12 23h6" />
      </g>
    </svg>
  );
}

export function IconeConfiguracoes(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...traco}>
        <circle cx="16" cy="16" r="4" />
        <path d="M16 3.5l2 3.2 3.6-1 .6 3.7 3.7.6-1 3.6 3.2 2-3.2 2 1 3.6-3.7.6-.6 3.7-3.6-1-2 3.2-2-3.2-3.6 1-.6-3.7-3.7-.6 1-3.6L3.5 16l3.2-2-1-3.6 3.7-.6.6-3.7 3.6 1z" />
      </g>
    </svg>
  );
}

export function IconeBusca(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g {...traco} strokeWidth="2">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
      </g>
    </svg>
  );
}

export function IconeUsuario(props) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <g {...traco} strokeWidth="2.6">
        <circle cx="24" cy="24" r="21" />
        <circle cx="24" cy="19" r="7" />
        <path d="M10.5 39.5c2.5-6 7.6-9.5 13.5-9.5s11 3.5 13.5 9.5" />
      </g>
    </svg>
  );
}

/* ---------------- Ilustrações dos nós ---------------- */
// Cores do Figma: amarelo dos bonecos, laranja/verde do quebra-cabeça,
// vermelho da prancheta, dourado da engrenagem.
const AMARELO = "#f7c948";
const CONTORNO = "#2b2a33";

function Boneco({ x, y, s = 1, cor = AMARELO }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={CONTORNO} strokeWidth="1.4" strokeLinejoin="round">
      <circle cx="0" cy="-9" r="5.2" fill={cor} />
      <path d="M-6.5 10V0c0-3.3 2.9-5 6.5-5s6.5 1.7 6.5 5v10z" fill={cor} />
    </g>
  );
}

export function IlustraComunicacao() {
  return (
    <svg viewBox="0 0 60 48" aria-hidden="true">
      <Boneco x={19} y={30} />
      <Boneco x={41} y={30} />
      <g stroke={CONTORNO} strokeWidth="1.3" strokeLinejoin="round">
        <path d="M24 6h11a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-6l-4 3v-3h-1a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z" fill="#fff" />
      </g>
      <g fill={CONTORNO}>
        <circle cx="26.5" cy="11" r="1.2" />
        <circle cx="30" cy="11" r="1.2" />
        <circle cx="33.5" cy="11" r="1.2" />
      </g>
    </svg>
  );
}

export function IlustraEquipe() {
  return (
    <svg viewBox="0 0 60 48" aria-hidden="true">
      <Boneco x={16} y={30} s={0.95} />
      <Boneco x={44} y={30} s={0.95} />
      <Boneco x={30} y={28} s={1.05} />
      <path d="M22 27h16" stroke={CONTORNO} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IlustraCriatividade() {
  return (
    <svg viewBox="0 0 60 48" aria-hidden="true">
      <g stroke={CONTORNO} strokeWidth="1.4" strokeLinejoin="round">
        {/* metade cérebro, metade lâmpada, como no Figma */}
        <path d="M30 8c-7.5 0-13 5.4-13 12.4 0 4.2 2 7.4 4.7 9.6V36h8.3z" fill="#f2a98a" />
        <path d="M30 8c7.5 0 13 5.4 13 12.4 0 4.2-2 7.4-4.7 9.6V36H30z" fill="#ffe066" />
        <path d="M26 36h8v3.5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" fill="#9aa3b5" />
      </g>
      <g fill="none" stroke="#c4705a" strokeWidth="1.2" strokeLinecap="round">
        <path d="M22 18c2-1 3.5 0 4 2M21.5 24c2.5 0 3.5 1.5 3.5 3M25 13c1.5 1 1.5 3 0 4" />
      </g>
      <path d="M33 22l2.5 6 2.5-6" fill="none" stroke="#b8860b" strokeWidth="1.3" strokeLinecap="round" />
      <g stroke="#ffe066" strokeWidth="2" strokeLinecap="round">
        <path d="M47 10l3-3M49 19h4M45 4.5l1-3" />
      </g>
    </svg>
  );
}

export function IlustraProblemas() {
  return (
    <svg viewBox="0 0 60 48" aria-hidden="true">
      <g transform="translate(30 24)">
        <path
          d="M0-17l3.4 4.2 5.2-1.6.9 5.4 5.4.9-1.6 5.2L17.5 0l-4.2 3.4 1.6 5.2-5.4.9-.9 5.4-5.2-1.6L0 17.5l-3.4-4.2-5.2 1.6-.9-5.4-5.4-.9 1.6-5.2L-17.5 0l4.2-3.4-1.6-5.2 5.4-.9.9-5.4 5.2 1.6z"
          fill="#f0a830"
          stroke="#a8661a"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle r="6.5" fill="#2f56d9" stroke="#a8661a" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

export function IlustraColaboracao() {
  return (
    <svg viewBox="0 0 60 48" aria-hidden="true">
      <circle cx="30" cy="25" r="16" fill="#3fa36b" stroke={CONTORNO} strokeWidth="1.3" />
      <path d="M17 18c4 1 6-1 9 1s1 6 5 7 7-2 10 1" fill="none" stroke="#2c7a52" strokeWidth="3" strokeLinecap="round" />
      {/* duas peças de quebra-cabeça se encaixando */}
      <g stroke={CONTORNO} strokeWidth="1.3" strokeLinejoin="round">
        <path d="M14 12h9v3.5a3 3 0 1 0 0 5V24h-9z" fill="#ef7d4a" />
        <path d="M37 26h9v9h-3.5a3 3 0 1 1-5 0H37v-3.5a3 3 0 1 0 0-5z" fill="#ef7d4a" />
      </g>
    </svg>
  );
}

export function IlustraOrganizacao() {
  return (
    <svg viewBox="0 0 60 48" aria-hidden="true">
      <g stroke={CONTORNO} strokeWidth="1.3" strokeLinejoin="round">
        <rect x="18" y="7" width="24" height="34" rx="2.5" fill="#e0603e" />
        <rect x="21" y="11" width="18" height="27" rx="1" fill="#fff" />
        <rect x="25" y="4.5" width="10" height="5" rx="1.5" fill="#c9cfdb" />
      </g>
      {[16, 23, 30].map((y) => (
        <g key={y}>
          <rect x="23" y={y - 2.5} width="5" height="5" rx="1" fill="#fff" stroke={CONTORNO} strokeWidth="1" />
          <path d={`M23.8 ${y}l1.6 1.6 3-3.4`} fill="none" stroke="#e0603e" strokeWidth="1.5" strokeLinecap="round" />
          <path d={`M30 ${y}h7`} stroke={CONTORNO} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

/* ---------------- Nó (disco 3D) e troféu ---------------- */

// Disco azul com lateral escura, como os nós do Figma.
export function DiscoNo({ id, Ilustracao, atual }) {
  const g = `disco-${id}`;
  return (
    <svg className="disco" viewBox="0 0 120 96" aria-hidden="true">
      <defs>
        <linearGradient id={`${g}-topo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={atual ? "#4b74f2" : "#3b63e6"} />
          <stop offset="1" stopColor={atual ? "#2c55dc" : "#2447c9"} />
        </linearGradient>
        <linearGradient id={`${g}-lado`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#151a33" />
          <stop offset="0.5" stopColor="#262d52" />
          <stop offset="1" stopColor="#151a33" />
        </linearGradient>
      </defs>
      {/* lateral */}
      <path d="M4 42v14c0 16.6 25 30 56 30s56-13.4 56-30V42z" fill={`url(#${g}-lado)`} />
      {/* topo */}
      <ellipse cx="60" cy="42" rx="56" ry="30" fill={`url(#${g}-topo)`} />
      {/* brilho na borda superior */}
      <path d="M14 34c8-12 26-19 46-19s38 7 46 19" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" strokeLinecap="round" />
      {Ilustracao && (
        <svg x="16" y="6" width="88" height="70" viewBox="0 0 60 48" overflow="visible">
          <Ilustracao />
        </svg>
      )}
    </svg>
  );
}

export function Trofeu() {
  return (
    <svg className="trofeu-svg" viewBox="0 0 168 172" aria-hidden="true">
      <defs>
        <linearGradient id="trofeu-ouro" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f2b51d" />
          <stop offset="0.35" stopColor="#ffd84a" />
          <stop offset="0.7" stopColor="#ffcc2e" />
          <stop offset="1" stopColor="#e8a414" />
        </linearGradient>
        <linearGradient id="trofeu-luz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* recorte no formato do troféu, para o reflexo não vazar */}
        <clipPath id="trofeu-recorte">
          <path d="M32 14h104v28c0 33-23 56-52 56S32 75 32 42z" />
          <path d="M74 96h20l-3 20H77z" />
          <path d="M54 126h60l5 20H49z" />
          <rect x="40" y="144" width="88" height="18" rx="5" />
        </clipPath>
        <linearGradient id="trofeu-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8a65" />
          <stop offset="1" stopColor="#e5643e" />
        </linearGradient>
      </defs>
      {/* alças */}
      <path
        d="M38 30H22c-10 0-16 8-14 19 2.5 14 16 26 33 31"
        fill="none"
        stroke="#f2b51d"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M130 30h16c10 0 16 8 14 19-2.5 14-16 26-33 31"
        fill="none"
        stroke="#f2b51d"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* taça */}
      <path d="M32 14h104v28c0 33-23 56-52 56S32 75 32 42z" fill="url(#trofeu-ouro)" />
      <ellipse cx="84" cy="14" rx="52" ry="7" fill="#ffe27a" />
      {/* reflexo */}
      <path d="M48 26c-2 16 1 32 10 44" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="6" strokeLinecap="round" />
      {/* estrela */}
      <path
        d="M84 32l7.6 15.4 17 2.5-12.3 12 2.9 16.9L84 70.8 68.8 78.8l2.9-16.9-12.3-12 17-2.5z"
        fill="#f0a500"
        stroke="#e09400"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* haste */}
      <path d="M74 96h20l-3 20H77z" fill="#f2b51d" />
      <rect x="66" y="114" width="36" height="8" rx="3" fill="#e8a414" />
      {/* base */}
      <path d="M54 126h60l5 20H49z" fill="url(#trofeu-base)" />
      <rect x="40" y="144" width="88" height="18" rx="5" fill="url(#trofeu-base)" />
      <rect x="40" y="144" width="88" height="5" rx="2.5" fill="rgba(255,255,255,0.25)" />
      {/* faixa de luz que atravessa o troféu (animada no CSS) */}
      <g clipPath="url(#trofeu-recorte)">
        <rect className="trofeu-reflexo" x="-70" y="-10" width="46" height="190" fill="url(#trofeu-luz)" />
      </g>
    </svg>
  );
}
