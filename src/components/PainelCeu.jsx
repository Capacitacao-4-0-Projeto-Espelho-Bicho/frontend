import { useMemo } from "react";
import cerebro from "../assets/cerebro.webp";

// Painel ilustrado do login: céu em degradê, estrelas e o cérebro do Figma.
// As estrelas são geradas em código (nítidas em qualquer tela). A semente é
// fixa, então o céu é sempre o mesmo, em todo carregamento e em toda máquina.

const TOTAL_ESTRELAS = 110;
const FRACAO_QUE_CINTILA = 0.3;

// Gerador pseudoaleatório determinístico (mulberry32).
function gerador(semente) {
  let a = semente;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gerarEstrelas() {
  const r = gerador(42);
  return Array.from({ length: TOTAL_ESTRELAS }, (_, i) => {
    // proporções do Figma: muitas estrelas médias e algumas grandes com halo
    const tamanho = r() < 0.7 ? 1.6 + r() * 1.2 : 2.8 + r() * 1.4;
    return {
      id: i,
      x: r() * 100,
      // como no Figma, mais estrelas no alto do céu
      y: Math.pow(r(), 1.9) * 66,
      tamanho,
      brilho: 0.55 + r() * 0.45,
      cintila: r() < FRACAO_QUE_CINTILA,
      duracao: 3 + r() * 4, // 3 a 7 s: cada uma no seu tempo
      atraso: -r() * 7, // negativo: já começam em fases diferentes
    };
  });
}

export function PainelCeu({ ativo }) {
  const estrelas = useMemo(gerarEstrelas, []);

  return (
    <div className={`painel-camada painel-ilustracao${ativo ? " ativo" : ""}`}>
      <div className="ceu-estrelas">
        {estrelas.map((e) => (
          <span
            key={e.id}
            className={`estrela${e.cintila ? " cintila" : ""}${e.tamanho > 2.8 ? " grande" : ""}`}
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              width: `${e.tamanho}px`,
              height: `${e.tamanho}px`,
              "--brilho": e.brilho,
              "--duracao": `${e.duracao}s`,
              "--atraso": `${e.atraso}s`,
            }}
          />
        ))}
      </div>
      <img className="cerebro" src={cerebro} alt="" width="343" height="324" />
    </div>
  );
}
