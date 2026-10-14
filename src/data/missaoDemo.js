// Missão de exemplo, tirada da "Especificação das Missões e Etapas de
// Desenvolvimento" (item 8, Comunicação). Enquanto o back-end não tiver as
// tabelas missao, etapa e execucao_etapa, a Home usa estes dados fixos.
//
// Estrutura: a missão tem N etapas (os nós da trilha) e um fechamento
// (o troféu). A etapa "desafio" é a principal e não pode ser pulada.
//
// Reunião de 14/10: o sistema não avalia material descritivo (texto,
// gravação). Toda etapa termina com uma checagem objetiva: "fiz / fiz em
// parte / não fiz" e uma lista curta para marcar. O número de etapas vai
// diminuir na revisão do documento; a trilha já aceita qualquer quantidade.
// PROVISÓRIO: etapas e checklists até a nova versão da especificação.

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
        "Responda quão importante e quão confiante você se sente nessa habilidade, de 1 a 5, e quanto tempo por dia você tem para a missão.",
      duracao: 5,
      reduzida: { duracao: 3, atividade: "Responda só as duas escalas, de 1 a 5." },
      escalas: [
        { id: "importancia", pergunta: "Quão importante é isso para você agora?" },
        { id: "confianca", pergunta: "Quão confiante você se sente nessa habilidade?" },
      ],
    },
    {
      id: "entender",
      tipo: "Entender",
      titulo: "O que é ser objetivo",
      atividade:
        "Compare duas explicações do mesmo assunto, uma longa e outra objetiva, e identifique a estrutura da versão objetiva: ideia, por quê, exemplo.",
      checklist: ["Comparei as duas explicações", "Identifiquei ideia, por quê e exemplo na versão objetiva"],
      duracao: 5,
      reduzida: { duracao: 3, atividade: "Veja um único par de explicações e marque a mais clara." },
    },
    {
      id: "guiada",
      tipo: "Prática guiada",
      titulo: "Reescreva para um leigo",
      atividade:
        "Reescreva um parágrafo técnico para alguém de fora da área, em até três frases, seguindo a estrutura ideia, por quê, exemplo.",
      checklist: ["Reescrevi o parágrafo em até três frases", "Segui a ordem ideia, por quê, exemplo"],
      duracao: 10,
      reduzida: { duracao: 5, atividade: "Reescreva só a primeira frase do parágrafo." },
    },
    {
      id: "contexto",
      tipo: "Prática no contexto",
      titulo: "Grave uma apresentação de 1 minuto",
      atividade: "Grave uma apresentação de 1 minuto sobre um tema do seu trabalho.",
      checklist: ["Gravei a apresentação", "Ficou dentro de 1 minuto", "Usei um tema do meu trabalho"],
      duracao: 10,
      ajustada: "Esta etapa foi ajustada ao seu tempo disponível: a atividade original tem 5 minutos de fala.",
      reduzida: { duracao: 5, atividade: "Comece com 30 segundos de fala." },
    },
    {
      id: "desafio",
      tipo: "Desafio",
      titulo: "Duas versões da mesma mensagem",
      atividade:
        "Escreva a mesma mensagem para um colega da área e para um leigo. Termine cada uma com uma pergunta que confira o entendimento. Depois marque o que você conseguiu fazer.",
      checklist: ["Escrevi a versão para um colega da área", "Escrevi a versão para um leigo", "Terminei as duas com uma pergunta de entendimento"],
      duracao: 15,
      obrigatoria: true,
      reduzida: { duracao: 10, atividade: "Escreva só a versão para o leigo, com a pergunta final." },
    },
    {
      id: "reflexao",
      tipo: "Reflexão",
      titulo: "O que fica desta missão",
      atividade: "Pense no que aconteceu nas práticas e escolha qual ação você vai tomar a partir daqui.",
      // reflexão sem texto livre: a pessoa escolhe uma ação
      acoes: [
        "Usar ideia, por quê e exemplo nas próximas mensagens",
        "Perguntar se fui entendido no fim das explicações",
        "Adaptar a linguagem quando falar com quem é de fora da área",
      ],
      duracao: 5,
      reduzida: { duracao: 2, atividade: "Escolha a ação que você vai tomar." },
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

// Resultado objetivo de cada etapa (reunião de 14/10: nada descritivo)
export const RESULTADOS_ETAPA = [
  { id: "fiz", rotulo: "Fiz" },
  { id: "parte", rotulo: "Fiz em parte" },
  { id: "nao", rotulo: "Não fiz" },
];

// Tempo por dia: calibra o tamanho das etapas e quantos lembretes a pessoa recebe
export const TEMPOS_DIA = [
  { id: "5", rotulo: "Até 5 minutos", lembretesPorSemana: 2 },
  { id: "15", rotulo: "Até 15 minutos", lembretesPorSemana: 3 },
  { id: "30", rotulo: "30 minutos ou mais", lembretesPorSemana: 5 },
];

// Quando o troféu não confirma o nível-alvo (reunião de 14/10)
export const MOTIVOS_NAO_ATINGIU = [
  { id: "contexto", rotulo: "O contexto que escolhi não ajudou" },
  { id: "tempo", rotulo: "Faltou tempo para fazer com calma" },
  { id: "dificil", rotulo: "As atividades foram difíceis" },
  { id: "outro", rotulo: "Outro motivo" },
];
