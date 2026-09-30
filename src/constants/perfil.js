// Opções dos campos de perfil do cadastro.
//
// PROVISÓRIO: o backend valida esses campos com CHECK constraint no Postgres,
// mas a lista completa de valores ainda não foi documentada (SCRUM-80).
// Por enquanto só há um valor por campo, o único que aparece em tests/test_auth.py.
// Completar as listas com os valores aceitos pelo backend antes do merge.

export const OPCOES_AMBIENTE = [
  { valor: "individual", rotulo: "Individual" }, // confirmado
];

export const OPCOES_TEMPO = [
  { valor: "ate_15_min", rotulo: "Até 15 minutos" }, // confirmado
];

export const OPCOES_RECURSOS = [
  { valor: "computador", rotulo: "Computador" }, // confirmado
];

export const OPCOES_INTERLOCUTORES = [
  { valor: "sozinho", rotulo: "Sozinho" }, // confirmado
];
