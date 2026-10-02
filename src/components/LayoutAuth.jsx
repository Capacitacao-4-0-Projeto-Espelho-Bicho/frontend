import painel from "../assets/painel-login.jpg";

// Moldura das telas de autenticação (Figma "Página de login"):
// cartão com o formulário à esquerda e o painel verde à direita.
// No celular, o painel vira um banner no topo.
// variante "frase": painel em degradê com a frase do cadastro, no lugar da ilustração.
export function LayoutAuth({ children, variante = "ilustracao" }) {
  return (
    <main className="pagina-auth">
      <div className="moldura">
        <section className="lado-form">
          <div className="conteudo-form">{children}</div>
          <footer className="rodape">© 2026 ALL RIGHTS RESERVED</footer>
        </section>

        {variante === "frase" ? (
          <aside className="lado-painel painel-frase" aria-hidden="true">
            <span className="aspas">“</span>
            <p>
              Avalie o seu repertório de competências para maximizar seus resultados e evoluir de
              forma consistente.
            </p>
          </aside>
        ) : (
          <aside
            className="lado-painel painel-ilustracao"
            style={{ "--img-painel": `url(${painel})`, backgroundImage: `url(${painel})` }}
            aria-hidden="true"
          />
        )}
      </div>
    </main>
  );
}
