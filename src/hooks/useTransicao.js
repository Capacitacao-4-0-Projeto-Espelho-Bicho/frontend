import { useCallback } from "react";
import { flushSync } from "react-dom";

// Troca de tela com a View Transitions API do navegador.
// O navegador tira uma "foto" da tela atual, aplica a mudança e anima
// entre as duas. Elementos com o mesmo view-transition-name nas duas telas
// (o cérebro do login e o logo da Home) viajam de um lugar para o outro.
// Sem suporte (Firefox antigo, Safari < 18) ou com "reduzir movimento",
// a troca acontece na hora, sem animação.
export function useTransicao() {
  return useCallback((mudar, tipo = "padrao") => {
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduzir) {
      mudar();
      return;
    }
    const raiz = document.documentElement;
    raiz.dataset.transicao = tipo;
    const t = document.startViewTransition(() => flushSync(mudar));
    t.finished.finally(() => delete raiz.dataset.transicao);
  }, []);
}
