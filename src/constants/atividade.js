// Cadastro de tarefas práticas (painel admin) -> POST /api/atividades.

export const NOME_MAX = 200; // limite do campo `nome` na API

// Tempo estimado. O valor segue o enum de `tempo` do back-end (os mesmos de
// constants/perfil.js). A API também exige `duracao_min` (inteiro), que o
// mockup não pergunta: usamos os minutos abaixo como representante da faixa.
// PROVISÓRIO: confirmar com o back-end/PO se a duração deve ser digitada.
export const OPCOES_TEMPO = [
  { valor: "ate_15_min", minutos: 15, rotulo: "15 minutos (Rápido)" },
  { valor: "15_a_45_min", minutos: 30, rotulo: "30 minutos (Moderado)" },
  { valor: "mais_45_min", minutos: 60, rotulo: "60 minutos (Expandido)" },
];

// Níveis (dificuldade). Os rótulos vêm de GET /api/niveis (Iniciante a
// Avançado); esta lista só entra se essa chamada falhar. A matriz de cada
// competência tem 4 níveis.
export const NIVEIS_PADRAO = [1, 2, 3, 4].map((ordem) => ({ id: ordem, ordem, nome: "" }));

// A API exige ao menos 1 questão com 2 alternativas pontuadas. Decisão do
// produto: toda tarefa termina com a autoavaliação de 1 a 4 (reunião de
// 14/10), então cada tarefa cadastrada leva uma questão com essa escala.
export const PONTOS_ESCALA = 4;
export const INSTRUCAO_ESCALA = "Avalie de 1 a 4 como você se saiu nesta tarefa.";

export const FORM_ATIVIDADE_INICIAL = {
  nome: "",
  competenciaId: "",
  habilidadeId: "",
  nivel: "",
  tempo: "",
  instrucao: "",
};

export function validarAtividade(form) {
  const n = {};
  const nome = form.nome.trim();
  if (!nome) n.nome = "Informe o título da tarefa.";
  else if (nome.length > NOME_MAX) n.nome = `O título pode ter até ${NOME_MAX} caracteres.`;
  if (!form.competenciaId) n.competenciaId = "Selecione a competência.";
  if (!form.habilidadeId) n.habilidadeId = "Selecione a sub-trilha.";
  if (!form.nivel) n.nivel = "Selecione o nível.";
  if (!form.tempo) n.tempo = "Selecione o tempo estimado.";
  if (!form.instrucao.trim()) n.instrucao = "Descreva o que a pessoa deve fazer.";
  return n;
}

export function montarPayloadAtividade(form) {
  const tempo = OPCOES_TEMPO.find((o) => o.valor === form.tempo);
  const instrucao = form.instrucao.trim();
  return {
    nome: form.nome.trim(),
    competencia_id: Number(form.competenciaId),
    habilidade_id: Number(form.habilidadeId),
    dificuldade: Number(form.nivel),
    duracao_min: tempo.minutos,
    tempo: tempo.valor,
    descricao: instrucao,
    questoes: [
      {
        ordem: 1,
        enunciado: instrucao,
        instrucoes: INSTRUCAO_ESCALA,
        alternativas: Array.from({ length: PONTOS_ESCALA }, (_, i) => ({
          ordem: i + 1,
          texto: String(i + 1),
          pontuacao: i + 1,
        })),
      },
    ],
  };
}
