// Opções dos campos de perfil do cadastro.
//
// O banco valida estes valores com CHECK (perfil_usuario). Listas conferidas
// em 28/10 no Render, valor por valor:
//   ambiente:       individual, em_aula, em_equipe, no_trabalho
//   interlocutores: sozinho, com_colega, com_grupo
//   tempo:          ate_15_min, 15_a_45_min, mais_45_min
//   recursos:       nenhum, papel_ou_celular, computador
// Qualquer outro valor faz o cadastro dar 500. Os textos (rotulo) podem mudar
// livremente; os valores só junto com o back-end.

export const PERGUNTAS_ETAPA_1 = [
  {
    campo: "ambiente",
    titulo: "Ambiente de prática",
    // Valores confirmados pelo Pedro em 28/10 (CHECK do banco). Eles descrevem
    // a situação em que a pessoa pratica, e não o formato de trabalho que o
    // Figma perguntava (presencial/remoto/híbrido/campo). Pergunta e textos
    // ajustados para bater com os valores; validar com o João/PO.
    pergunta: "Em que situação você costuma ter tempo para praticar?",
    opcoes: [
      { valor: "individual", rotulo: "Sozinho, por conta própria" },
      { valor: "em_aula", rotulo: "Em aula ou curso" },
      { valor: "em_equipe", rotulo: "Junto com a minha equipe" },
      { valor: "no_trabalho", rotulo: "No trabalho, durante a rotina" },
    ],
  },
  {
    campo: "interlocutores",
    titulo: "Interlocutores presentes (oportunidade social)",
    pergunta: "Com quem você interage ou tem contato direto durante a sua rotina diária?",
    opcoes: [
      { valor: "sozinho", rotulo: "Trabalho individual (pouca ou nenhuma interação com pessoas)" },
      { valor: "com_colega", rotulo: "Com um colega por vez" },
      { valor: "com_grupo", rotulo: "Com um grupo ou equipe" },
    ],
  },
  {
    campo: "tempo",
    titulo: "Tempo disponível para prática",
    pergunta: "Quanto tempo você consegue reservar em sua rotina para realizar uma microatividade prática?",
    opcoes: [
      { valor: "ate_15_min", rotulo: "Rápido (até 15 minutos)" },
      { valor: "15_a_45_min", rotulo: "Moderado (15 a 45 minutos)" },
      { valor: "mais_45_min", rotulo: "Expandido (mais de 45 minutos)" },
    ],
  },
];

export const PERGUNTAS_ETAPA_2 = [
  {
    campo: "recursos",
    titulo: "Recursos materiais",
    pergunta: "Quais recursos e ferramentas estão imediatamente acessíveis no seu local de trabalho?",
    opcoes: [
      { valor: "computador", rotulo: "Computador e ferramentas de comunicação online" },
      { valor: "papel_ou_celular", rotulo: "Papel, caderno ou celular" },
      { valor: "nenhum", rotulo: "Apenas as tarefas operacionais habituais, sem recursos extras" },
    ],
  },
];
