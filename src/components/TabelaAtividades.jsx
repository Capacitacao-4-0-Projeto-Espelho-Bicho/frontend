// Lista de tarefas cadastradas (GET /api/atividades), com os nomes de
// competência e sub-trilha vindos do catálogo. O mockup tinha uma coluna
// Status; a API não tem esse dado, então ela ficou de fora.
// `atividades`: lista da API; `nomes`: mapas id -> nome, de useCatalogo;
// `carregando` e `erro` vêm da tela (lista e catálogo).
export function TabelaAtividades({ atividades, nomes, carregando, erro, aoTentarDeNovo }) {
  let corpo;
  if (carregando) {
    corpo = (
      <p className="admin-vazio" role="status">
        Carregando tarefas…
      </p>
    );
  } else if (erro) {
    corpo = (
      <div className="admin-vazio">
        <p role="alert">{erro}</p>
        <button type="button" className="cartao-link" onClick={aoTentarDeNovo}>
          Tentar de novo
        </button>
      </div>
    );
  } else if (atividades.length === 0) {
    corpo = <p className="admin-vazio">Nenhuma tarefa cadastrada ainda. A primeira aparece aqui.</p>;
  } else {
    corpo = (
      <div className="admin-tabela-rolagem" role="region" aria-label="Tarefas cadastradas" tabIndex={0}>
        <table className="admin-tabela">
          <caption className="so-leitor">Tarefas cadastradas</caption>
          <thead>
            <tr>
              <th scope="col">Tarefa</th>
              <th scope="col">Competência</th>
              <th scope="col">Sub-trilha</th>
              <th scope="col">Nível</th>
            </tr>
          </thead>
          <tbody>
            {atividades.map((a) => (
              <tr key={a.id}>
                <th scope="row">{a.nome}</th>
                <td>{nomes.competencia.get(a.competencia_id) ?? "—"}</td>
                <td>{nomes.habilidade.get(a.habilidade_id) ?? "—"}</td>
                <td>
                  <span className="admin-nivel">Nível {a.dificuldade}</span>
                  <span className="so-leitor">, {a.duracao_min} minutos</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="admin-cartao admin-lista" aria-labelledby="admin-lista-titulo" aria-busy={carregando}>
      <h2 id="admin-lista-titulo" className="admin-cartao-titulo">
        Tarefas, competências e sub-trilhas
      </h2>
      {corpo}
    </section>
  );
}
