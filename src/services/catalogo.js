import { request } from "./api";

// Contrato da API (documentado em /dev; spec em /apispec_1.json). Todas as
// rotas exigem token de acesso, por isso `auth: true`.
// GET /api/competencias                      -> 200 [{ id, nome, descricao }]
// GET /api/competencias/{id}/habilidades     -> 200 [{ id, nome, descricao, ordem, competencia_id }]
//                                               404 { error } competência inexistente
// GET /api/niveis                            -> 200 [{ id, nome, descricao, ordem,
//                                                      pontuacao_minima, pontuacao_maxima }]

export function listarCompetencias(opcoes = {}) {
  return request("/api/competencias", { auth: true, ...opcoes });
}

export function listarHabilidades(competenciaId, opcoes = {}) {
  return request(`/api/competencias/${competenciaId}/habilidades`, { auth: true, ...opcoes });
}

export function listarNiveis(opcoes = {}) {
  return request("/api/niveis", { auth: true, ...opcoes });
}
