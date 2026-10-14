// Missão de exemplo, tirada da "Especificação das Missões e Etapas de
// Desenvolvimento" (item 8, Comunicação). Enquanto o back-end não tiver as
// tabelas missao, etapa e execucao_etapa, a Home usa estes dados fixos.
//
// Estrutura: toda missão tem 6 etapas (os nós da trilha) e um fechamento
// (o troféu). A etapa 5 é a evidência principal e não pode ser pulada.

export const MISSAO_DEMO = {
  id: "comunicacao-2-3",
  nome: "Uma ideia, um minuto",
  competencia: "Comunicação",
  habilidade:
    "Comunicar de forma objetiva, simples e clara, adequando a linguagem a diferentes públicos e checando o entendimento",
  habilidadeCurta: "Comunicar de forma objetiva",
  nivelOrigem: 2,
  nivelAlvo: 3,
  duracaoTotal: "cerca de 50 minutos",
  proxima: "Trabalho em equipe", // provisório: quem decide é a seleção da seção 9.1
  // PROVISÓRIO: o documento não traz os descritores desta habilidade
  // (ponto em aberto 11). Trocar pelos da Rubrica SENAI completa.
  descritores: {
    2: "Explico as ideias, mas nem sempre de forma objetiva ou adequada a quem está ouvindo.",
    3: "Comunico de forma objetiva e clara, adapto a linguagem ao público e confiro se fui entendido.",
  },
  etapas: [
    {
      id: "partida",
      tipo: "Ponto de partida",
      titulo: "De onde você parte",
      atividade:
        "Escreva em uma frase a ideia principal do seu trabalho atual. Depois, responda quão importante e quão confiante você se sente nessa habilidade, de 1 a 5.",
      evidencia: "Escalas de 1 a 5 e resposta curta",
      duracao: 5,
      reduzida: { duracao: 3, atividade: "Responda só as duas escalas, de 1 a 5." },
    },
    {
      id: "entender",
      tipo: "Entender",
      titulo: "O que é ser objetivo",
      atividade:
        "Compare duas explicações do mesmo assunto, uma longa e outra objetiva, e identifique a estrutura da versão objetiva: ideia, por quê, exemplo.",
      evidencia: "Respostas objetivas com feedback imediato",
      duracao: 5,
      reduzida: { duracao: 3, atividade: "Veja um único par de explicações e marque a mais clara." },
    },
    {
      id: "guiada",
      tipo: "Prática guiada",
      titulo: "Reescreva para um leigo",
      atividade:
        "Reescreva um parágrafo técnico para alguém de fora da área, em até três frases, seguindo a estrutura ideia, por quê, exemplo.",
      evidencia: "Texto curto, conferido por checklist",
      duracao: 10,
      reduzida: { duracao: 5, atividade: "Reescreva só a primeira frase do parágrafo." },
    },
    {
      id: "contexto",
      tipo: "Prática no contexto",
      titulo: "Grave uma apresentação de 1 minuto",
      atividade: "Grave uma apresentação de 1 minuto sobre um tema do seu trabalho.",
      evidencia: "Registro da aplicação",
      duracao: 10,
      ajustada: "Esta etapa foi ajustada ao seu tempo disponível: a atividade original tem 5 minutos de fala.",
      reduzida: { duracao: 5, atividade: "Comece com 30 segundos de fala." },
    },
    {
      id: "desafio",
      tipo: "Desafio",
      titulo: "Duas versões da mesma mensagem",
      atividade:
        "Escreva a mesma mensagem para um colega da área e para um leigo. Termine cada uma com uma pergunta que confira o entendimento e revise as duas com o checklist.",
      evidencia: "Evidência principal da missão",
      duracao: 15,
      obrigatoria: true,
      reduzida: { duracao: 10, atividade: "Escreva só a versão para o leigo, com a pergunta final." },
    },
    {
      id: "reflexao",
      tipo: "Reflexão",
      titulo: "O que fica desta missão",
      atividade: "Conte o que aconteceu nas práticas e qual ação você vai tomar a partir daqui.",
      evidencia: "Texto livre curto",
      duracao: 5,
      reduzida: { duracao: 2, atividade: "Escreva uma frase sobre a ação que você vai tomar." },
    },
  ],
};

// Motivos de recusa (lista fechada da seção 9.2)
export const MOTIVOS_RECUSA = [
  { id: "tempo", rotulo: "Não tenho tempo agora" },
  { id: "dificil", rotulo: "Achei difícil" },
  { id: "utilidade", rotulo: "Não vejo utilidade" },
  { id: "recursos", rotulo: "Não tenho os recursos necessários" },
  { id: "outro", rotulo: "Outro" },
];
