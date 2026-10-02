// Opções dos campos de perfil do cadastro, com os textos do Figma.
//
// ATENÇÃO: o backend valida estes valores com CHECK constraint no Postgres,
// mas a lista oficial ainda não foi documentada (SCRUM-80).
// - "confirmado": valor que aparece em tests/test_auth.py, aceito pelo backend.
// - sem marcação: valor provisório, CONFIRMAR com o backend antes do merge.
//
// Obs.: o teste usa ambiente = "individual", que não corresponde a nenhuma
// opção de ambiente do Figma. Verificar com o backend qual é a lista real.

export const PERGUNTAS_ETAPA_1 = [
  {
    campo: "ambiente",
    titulo: "Ambiente de trabalho",
    pergunta: "Qual é o seu formato de trabalho/estudo predominante no dia a dia?",
    opcoes: [
      { valor: "presencial", rotulo: "Presencial em escritório ou unidade operacional" },
      { valor: "remoto", rotulo: "Remoto / Home Office" },
      { valor: "hibrido", rotulo: "Híbrido" },
      { valor: "campo", rotulo: "Atividades de campo ou externas" },
    ],
  },
  {
    campo: "interlocutores",
    titulo: "Interlocutores presentes (oportunidade social)",
    pergunta: "Com quem você interage ou tem contato direto durante a sua rotina diária?",
    opcoes: [
      { valor: "sozinho", rotulo: "Trabalho individual (pouca ou nenhuma interação com pessoas)" }, // confirmado
      { valor: "pares", rotulo: "Apenas com colegas de equipe / pares no mesmo nível" },
      { valor: "lideranca", rotulo: "Diretamente com liderança / gestores" },
      { valor: "clientes", rotulo: "Com clientes internos/externos, fornecedores ou público" },
    ],
  },
  {
    campo: "tempo",
    titulo: "Tempo disponível para prática",
    pergunta: "Quanto tempo você consegue reservar em sua rotina para realizar uma microatividade prática?",
    opcoes: [
      { valor: "ate_15_min", rotulo: "Rápido (até 15 minutos)" }, // confirmado
      { valor: "15_a_30_min", rotulo: "Moderado (15 a 30 minutos)" },
      { valor: "mais_30_min", rotulo: "Expandido (mais de 30 minutos)" },
    ],
  },
];

export const PERGUNTAS_ETAPA_2 = [
  {
    campo: "recursos",
    titulo: "Recursos materiais",
    pergunta: "Quais recursos e ferramentas estão imediatamente acessíveis no seu local de trabalho?",
    opcoes: [
      { valor: "computador", rotulo: "Computador e ferramentas de comunicação online" }, // confirmado
      { valor: "celular", rotulo: "Dispositivo móvel (smartphone/tablet)" },
      { valor: "caderno", rotulo: "Caderno, quadro físico ou bloco de anotações" },
      { valor: "nenhum", rotulo: "Apenas as tarefas operacionais habituais, sem recursos extras" },
    ],
  },
];
