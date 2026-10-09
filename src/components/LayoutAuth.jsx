import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PainelCeu } from "./PainelCeu";
import cerebro from "../assets/cerebro.webp";
import { FundoCeu, useTema } from "./FundoHome";
import "../styles/fundos.css";

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
  // Depois a classe sai (ao fim da entrada do cérebro, a última), para que
  // nada (resize, troca de rota) a reinicie.
  const [revelando, setRevelando] = useState(true);
  const tema = useTema();

  return (
    <main className="pagina-auth">
      {tema === "ceu" && <FundoCeu constelacoes={false} />}
      <div className="moldura">
        <section className="lado-form">
          {/* Cabeçalho do layout web (some no celular, onde o banner faz esse papel) */}
          <header className="topo-web">
            <span className="marca">
              <span className="marca-simbolo" aria-hidden="true">
                <img src={cerebro} alt="" />
              </span>
              Capacitação 4.0
            </span>
          </header>
          {/* key = rota: o conteúdo remonta e anima só quando a tela muda */}
          <div className="conteudo-form troca-tela" key={pathname}>
            <Outlet />
          </div>
          <footer className="rodape">© 2026 Capacitação 4.0</footer>
        </section>

        <aside
          className={`lado-painel${revelando ? " revelando" : ""}`}
          aria-hidden="true"
          onAnimationEnd={(e) => e.animationName === "cerebro-entra" && setRevelando(false)}
        >
          <PainelCeu ativo={variante === "ilustracao"} />
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
