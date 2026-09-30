// Campo de formulário com rótulo e mensagem de erro, reutilizado nas telas.
export function Campo({ id, rotulo, erro, children }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      {children}
      {erro && (
        <span className="campo-erro" id={`${id}-erro`}>
          {erro}
        </span>
      )}
    </div>
  );
}

export function Selecao({ id, rotulo, opcoes, erro, ...props }) {
  return (
    <Campo id={id} rotulo={rotulo} erro={erro}>
      <select id={id} name={id} aria-invalid={Boolean(erro)} {...props}>
        <option value="">Selecione</option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </Campo>
  );
}
