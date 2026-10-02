import { useAuth } from "../context/AuthContext";
import { LayoutAuth } from "../components/LayoutAuth";

// Placeholder: a Home definitiva depende do layout aprovado na SCRUM-78.
export default function Home() {
  const { sair } = useAuth();
  return (
    <LayoutAuth>
      <h1>Você está logado</h1>
      <p className="subtitulo">A página inicial será implementada quando o layout da Home for aprovado.</p>
      <button type="button" className="botao-primario" onClick={sair}>
        Sair
      </button>
    </LayoutAuth>
  );
}
