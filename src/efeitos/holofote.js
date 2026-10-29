// Holofote nos botões (tema céu): uma luz suave segue o cursor dentro do
// botão. Só liga em telas com mouse; no toque não existe hover.
// Um único ouvinte no documento, limitado a um quadro por vez.

const ALVO = ".botao-primario, .botao-azul, .botao-secundario";

export function ligarHolofote() {
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let quadro = 0;
  let ultimo = null;

  document.addEventListener(
    "pointermove",
    (e) => {
      ultimo = e;
      if (quadro) return;
      quadro = requestAnimationFrame(() => {
        quadro = 0;
        const botao = ultimo.target instanceof Element ? ultimo.target.closest(ALVO) : null;
        if (!botao) return;
        const r = botao.getBoundingClientRect();
        botao.style.setProperty("--mx", `${ultimo.clientX - r.left}px`);
        botao.style.setProperty("--my", `${ultimo.clientY - r.top}px`);
      });
    },
    { passive: true }
  );
}
