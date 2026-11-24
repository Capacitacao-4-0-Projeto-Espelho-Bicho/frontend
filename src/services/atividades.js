import { request } from "./api";

// Contrato da API (documentado em /dev; spec em /apispec_1.json).
//
// GET  /api/atividades?competencia_id=&habilidade_id=&dificuldade=
//      -> 200 [{ id, nome, descricao, competencia_id, habilidade_id, dificuldade,
//                duracao_min, tempo, ambiente, interlocutores, recursos }]
//         (resumo, sem questões). 400 { error } filtro inválido.
//
// POST /api/atividades  (somente gestor e admin)
//      corpo: { nome*, competencia_id*, habilidade_id*, dificuldade*, duracao_min*,
//               descricao, tempo, ambiente, interlocutores, recursos,
//               questoes*: [{ ordem*, enunciado*, instrucoes,
//                             alternativas*: [{ ordem*, texto*, pontuacao*, justificativa }] }] }
//         (pelo menos 1 questão e 2 alternativas por questão; ordens positivas e únicas)
//      -> 201 a atividade completa, com ids
//         400 { error } dados inválidos | 403 sem permissão | 409 { error } conflito
//         Nada é criado quando há erro (transação única).

export function listarAtividades(filtros = {}, opcoes = {}) {
  const busca = new URLSearchParams();
  for (const [chave, valor] of Object.entries(filtros)) {
    if (valor !== undefined && valor !== null && valor !== "") busca.set(chave, valor);
  }
  const texto = busca.toString();
  return request(`/api/atividades${texto ? `?${texto}` : ""}`, { auth: true, ...opcoes });
}

export function cadastrarAtividade(dados, opcoes = {}) {
  return request("/api/atividades", { method: "POST", body: dados, auth: true, ...opcoes });
}
