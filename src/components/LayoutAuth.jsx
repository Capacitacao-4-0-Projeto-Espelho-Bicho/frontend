import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import painel from "../assets/painel-login.jpg";

// Moldura das telas de autenticação (Figma "Página de login"):
// cartão com o formulário à esquerda e o painel verde à direita.
// No celular, o painel vira um banner no topo.
//
// É uma rota de layout: fica montada enquanto a pessoa navega entre
// login, cadastro e home. Por isso o painel não "pisca" na troca de tela;
// só o conteúdo do formulário entra de novo, e o painel faz um crossfade
// entre a ilustração (login) e a frase (cadastro).
export function LayoutAuth() {
  const { pathname } = useLocation();
  const variante = pathname.startsWith("/cadastro") ? "frase" : "ilustracao";
  // A revelação do painel acontece uma única vez, ao abrir a página.
  // Depois a classe sai, para que nada (resize, troca de rota) a reinicie.
  const [revelando, setRevelando] = useState(true);

  return (
    <main className="pagina-auth">
      <div className="moldura">
        <section className="lado-form">
          {/* key = rota: o conteúdo remonta e anima só quando a tela muda */}
          <div className="conteudo-form troca-tela" key={pathname}>
            <Outlet />
          </div>
          <footer className="rodape">© 2026 ALL RIGHTS RESERVED</footer>
        </section>

        <aside
          className={`lado-painel${revelando ? " revelando" : ""}`}
          aria-hidden="true"
          onAnimationEnd={(e) => e.animationName === "painel-revela" && setRevelando(false)}
        >
          <div
            className={`painel-camada painel-ilustracao${variante === "ilustracao" ? " ativo" : ""}`}
            style={{ "--img-painel": `url(${painel})`, backgroundImage: `url(${painel})` }}
          />
          <div className={`painel-camada painel-frase${variante === "frase" ? " ativo" : ""}`}>
            <span className="aspas">“</span>
            <p>
              Avalie o seu repertório de competências para maximizar seus resultados e evoluir de
              forma consistente.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
