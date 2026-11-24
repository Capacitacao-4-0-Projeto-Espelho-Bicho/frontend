import { useCallback, useEffect, useMemo, useState } from "react";
import { listarCompetencias, listarHabilidades, listarNiveis } from "../services/catalogo";
import { NIVEIS_PADRAO } from "../constants/atividade";

// Carrega uma única vez o catálogo que o painel admin usa: competências, as
// habilidades (sub-trilhas) de cada uma e os níveis. Formulário e tabela leem
// daqui, então trocar a competência no select não faz nova chamada.
export function useCatalogo() {
  const [tentativa, setTentativa] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [demorando, setDemorando] = useState(false);
  const [erro, setErro] = useState("");
  const [competencias, setCompetencias] = useState([]);
  const [habilidades, setHabilidades] = useState([]); // todas, com competencia_id
  const [niveis, setNiveis] = useState(NIVEIS_PADRAO);

  useEffect(() => {
    let ativo = true;
    const opcoes = { aoDemorar: () => ativo && setDemorando(true) };
    setCarregando(true);
    setErro("");

    (async () => {
      try {
        const [lista, listaNiveis] = await Promise.all([
          listarCompetencias(opcoes),
          // sem os rótulos dos níveis o formulário ainda funciona com 1 a 4
          listarNiveis(opcoes).catch(() => null),
        ]);
        const porCompetencia = await Promise.all(lista.map((c) => listarHabilidades(c.id, opcoes)));
        if (!ativo) return;
        setCompetencias(lista);
        setHabilidades(porCompetencia.flat());
        if (Array.isArray(listaNiveis) && listaNiveis.length) setNiveis(listaNiveis);
      } catch (e) {
        if (ativo) setErro(e.message);
      } finally {
        if (ativo) {
          setCarregando(false);
          setDemorando(false);
        }
      }
    })();

    return () => {
      ativo = false;
    };
  }, [tentativa]);

  const recarregar = useCallback(() => setTentativa((t) => t + 1), []);

  const nomes = useMemo(
    () => ({
      competencia: new Map(competencias.map((c) => [c.id, c.nome])),
      habilidade: new Map(habilidades.map((h) => [h.id, h.nome])),
    }),
    [competencias, habilidades]
  );

  const habilidadesDe = useCallback(
    (competenciaId) => habilidades.filter((h) => h.competencia_id === Number(competenciaId)),
    [habilidades]
  );

  return { carregando, demorando, erro, recarregar, competencias, niveis, habilidadesDe, nomes };
}
