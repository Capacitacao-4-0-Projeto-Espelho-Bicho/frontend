import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import { RotaProtegida } from "./components/RotaProtegida";
import { LayoutAuth } from "./components/LayoutAuth";

export default function App() {
  return (
    <Routes>
      {/* Layout compartilhado: o painel lateral persiste entre as telas */}
      <Route element={<LayoutAuth />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/"
          element={
            <RotaProtegida>
              <Home />
            </RotaProtegida>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
