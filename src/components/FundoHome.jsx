import { useEffect, useMemo, useRef, useState } from "react";

// Propostas de fundo da Home. O tema vem do atributo data-tema no <html>
// ("ceu", "paisagem" ou "mapa"); sem atributo, a Home fica como está.

export function useTema() {
  const ler = () => document.documentElement.dataset.tema || "";
  const [tema, setTema] = useState(ler);
  useEffect(() => {
    const obs = new MutationObserver(() => setTema(ler()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
    return () => obs.disconnect();
  }, []);
  return tema;
}

// gerador determinístico: o céu é sempre o mesmo
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

function estrelas(qtd, semente, alturaMax = 100) {
  const r = gerador(semente);
  return Array.from({ length: qtd }, (_, i) => {
    const grande = r() > 0.82;
    return {
      id: i,
      x: r() * 100,
      y: Math.pow(r(), 1.3) * alturaMax,
      t: grande ? 2.2 + r() * 1.6 : 1 + r() * 1.2,
      brilho: 0.35 + r() * 0.6,
      cintila: r() < 0.22,
      dur: 3 + r() * 5,
      atraso: -r() * 8,
    };
  });
}

function CampoEstrelas({ lista }) {
  return lista.map((e) => (
    <span
      key={e.id}
      className={`fundo-estrela${e.cintila ? " cintila" : ""}`}
      style={{
        left: `${e.x}%`,
        top: `${e.y}%`,
        width: e.t,
        height: e.t,
        "--brilho": e.brilho,
        "--dur": `${e.dur}s`,
        "--atraso": `${e.atraso}s`,
      }}
    />
  ));
}

/* A. Céu noturno: o mesmo céu na Home e no login.
   Movimento: estrelas cintilando, aurora que respira devagar, uma estrela
   cadente de vez em quando e, no computador, as estrelas acompanham o mouse
   de leve (duas camadas em profundidades diferentes). */
function useEstrelasCadentes(ativo) {
  const [cadentes, setCadentes] = useState([]);
  useEffect(() => {
    if (!ativo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let vivo = true;
    let timer;
    let id = 0;
    const agendar = () => {
      timer = setTimeout(() => {
        if (!vivo) return;
        const nova = {
          id: id++,
          x: 15 + Math.random() * 70,
          y: Math.random() * 35,
          ang: 18 + Math.random() * 20,
          comp: 90 + Math.random() * 90,
        };
        setCadentes((l) => [...l.slice(-2), nova]);
        setTimeout(() => vivo && setCadentes((l) => l.filter((c) => c.id !== nova.id)), 1600);
        agendar();
      }, 5000 + Math.random() * 7000);
    };
    agendar();
    return () => {
      vivo = false;
      clearTimeout(timer);
    };
  }, [ativo]);
  return cadentes;
}

export function FundoCeu({ constelacoes = true }) {
  const longe = useMemo(() => estrelas(130, 11), []);
  const perto = useMemo(() => estrelas(45, 37), []);
  const cadentes = useEstrelasCadentes(true);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const fino = window.matchMedia("(pointer: fine)").matches;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !fino || reduzir) return;
    let quadro;
    const mover = (e) => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty("--mx", dx.toFixed(3));
        el.style.setProperty("--my", dy.toFixed(3));
      });
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => {
      window.removeEventListener("pointermove", mover);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <div className="fundo fundo-ceu" aria-hidden="true" ref={ref}>
      <div className="ceu-brilho" />
      <div className="ceu-camada ceu-longe">
        <CampoEstrelas lista={longe} />
      </div>
      <div className="ceu-camada ceu-perto">
        <CampoEstrelas lista={perto} />
      </div>
      {cadentes.map((c) => (
        <span
          key={c.id}
          className="estrela-cadente"
          style={{ left: `${c.x}%`, top: `${c.y}%`, "--ang": `${c.ang}deg`, "--comp": `${c.comp}px` }}
        />
      ))}
      {constelacoes && (
        <svg className="constelacao" viewBox="0 0 100 60" preserveAspectRatio="none">
          <polyline points="66,16 72,22 79,19 85,27 93,24" />
          <polyline points="70,40 76,35 82,38 88,33" />
          {[[66, 16], [72, 22], [79, 19], [85, 27], [93, 24], [70, 40], [76, 35], [82, 38], [88, 33]].map(([x, y]) => (
            <line key={`${x}-${y}`} x1={x} y1={y} x2={x} y2={y} />
          ))}
        </svg>
      )}
    </div>
  );
}

/* B. Paisagem: amanhecer com morros em camadas; a faixa da trilha é o chão */
function FundoPaisagem() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // os morros ficam logo acima da faixa da trilha, onde quer que ela esteja
    const trilha = document.querySelector(".home-trilha");
    const medir = () => trilha && el.style.setProperty("--topo-trilha", `${trilha.offsetTop}px`);
    medir();
    const ro = new ResizeObserver(medir);
    trilha && ro.observe(trilha);
    window.addEventListener("resize", medir);
    // paralaxe leve: os morros de trás andam mais devagar que a rolagem
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const aoRolar = () => el.style.setProperty("--rolagem", `${window.scrollY}px`);
    if (!reduzir) window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", medir);
      window.removeEventListener("scroll", aoRolar);
    };
  }, []);
  return (
    <div className="fundo fundo-paisagem" aria-hidden="true" ref={ref}>
      <div className="paisagem-ceu" />
      <div className="paisagem-sol" />
      <svg className="morros" viewBox="0 0 1600 300" preserveAspectRatio="none">
        <path className="morro morro-1" d="M0 150 C 180 90, 360 110, 520 140 S 860 80, 1060 120 S 1400 90, 1600 130 V300 H0z" />
        <path className="morro morro-2" d="M0 200 C 220 150, 420 170, 640 195 S 1000 140, 1220 180 S 1480 160, 1600 175 V300 H0z" />
        <path className="morro morro-3" d="M0 250 C 260 215, 520 235, 760 245 S 1180 215, 1600 240 V300 H0z" />
      </svg>
    </div>
  );
}

/* C. Mapa topográfico: curvas de nível, como num mapa de trilha */
function FundoMapa() {
  return (
    <div className="fundo fundo-mapa" aria-hidden="true">
      <div className="mapa-curvas" />
      <div className="mapa-esmaecer" />
    </div>
  );
}

export function FundoHome({ tema }) {
  if (tema === "ceu") return <FundoCeu />;
  if (tema === "paisagem") return <FundoPaisagem />;
  if (tema === "mapa") return <FundoMapa />;
  return null;
}
