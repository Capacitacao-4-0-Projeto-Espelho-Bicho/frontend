// Feedback implícito (reunião de 14/10): o uso da interface já diz se a
// pessoa está engajada, sem precisar perguntar o tempo todo.
// Por enquanto os eventos ficam só na memória desta aba (e no console em
// desenvolvimento). Quando a equipe escolher a ferramenta (Firebase
// Analytics ou uma rota no back-end), basta trocar o corpo de enviar().

const eventos = [];

function enviar(evento) {
  if (import.meta.env.DEV) console.debug("[rastreio]", evento.nome, evento.dados);
}

export function registrarEvento(nome, dados = {}) {
  const evento = { nome, dados, em: new Date().toISOString() };
  eventos.push(evento);
  enviar(evento);
}

// Mede quanto tempo algo ficou aberto (ex.: o cartão de uma etapa).
// Uso: const parar = medirTempo("cartao_etapa", { etapa }); ... parar();
export function medirTempo(nome, dados = {}) {
  const inicio = performance.now();
  return () => registrarEvento(nome, { ...dados, ms: Math.round(performance.now() - inicio) });
}

export function eventosRegistrados() {
  return eventos.slice();
}
