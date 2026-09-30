import { useAuth } from "../context/AuthContext";

// Placeholder: a Home definitiva depende do layout aprovado na SCRUM-78.
export default function Home() {
  const { sair } = useAuth();
  return (
    <main className="pagina-auth">
      <section className="card">
        <h1>Você está logado</h1>
        <p>A página inicial será implementada quando o layout da Home for aprovado.</p>
        <button type="button" onClick={sair}>
          Sair
        </button>
      </section>
    </main>
  );
}
