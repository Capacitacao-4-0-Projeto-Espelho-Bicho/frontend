// Campo de formulário com rótulo e mensagem de erro, reutilizado nas telas.
export function Campo({ id, rotulo, erro, children }) {
  return (
    <div className={`campo${erro ? " campo-com-erro" : ""}`}>
      <label htmlFor={id}>{rotulo}</label>
      {children}
      {erro && (
        <span className="campo-erro" id={`${id}-erro`} role="alert">
          {erro}
        </span>
      )}
    </div>
  );
}

// Grupo de opções em radio (perguntas de perfil do cadastro).
export function GrupoRadio({ campo, titulo, pergunta, opcoes, valor, onChange, erro }) {
  return (
    <fieldset className={`grupo-radio${erro ? " campo-com-erro" : ""}`}>
      <legend>
        <span className="grupo-titulo">{titulo}</span>
        <span className="grupo-pergunta">{pergunta}</span>
      </legend>
      {opcoes.map((o) => (
        <label key={o.valor} className="opcao">
          <input
            type="radio"
            name={campo}
            value={o.valor}
            checked={valor === o.valor}
            onChange={onChange}
          />
          <span>{o.rotulo}</span>
        </label>
      ))}
      {erro && (
        <span className="campo-erro" role="alert">
          {erro}
        </span>
      )}
    </fieldset>
  );
}
