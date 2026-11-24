import { useEffect, useRef, useState } from "react";
import { Campo } from "./Campo";
import { IconeConfiguracoes } from "./IconesHome";
import { cadastrarAtividade } from "../services/atividades";
import {
  FORM_ATIVIDADE_INICIAL,
  NOME_MAX,
  OPCOES_TEMPO,
  montarPayloadAtividade,
  validarAtividade,
} from "../constants/atividade";

// Formulário "Registrar Nova Tarefa Prática" do painel admin. Envia
// POST /api/atividades; o contrato e o que vai fixo (a questão de
// autoavaliação) estão em services/atividades.js e constants/atividade.js.
// `catalogo` vem de useCatalogo; `aoCadastrar(atividade)` recebe o 201.
export function FormularioAtividade({ catalogo, aoCadastrar }) {
  const { competencias, niveis, habilidadesDe, carregando, erro: erroCatalogo } = catalogo;
  const [form, setForm] = useState(FORM_ATIVIDADE_INICIAL);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [demorando, setDemorando] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const formRef = useRef(null);

  // depois de uma validação que falhou, o foco vai para o primeiro campo com erro
  useEffect(() => {
    if (tentativas) formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [tentativas]);

  function atualizar(e) {
    const { name, value } = e.target;
    // trocar a competência invalida a sub-trilha escolhida
    setForm((f) => ({ ...f, [name]: value, ...(name === "competenciaId" ? { habilidadeId: "" } : {}) }));
    if (erros[name]) setErros((n) => ({ ...n, [name]: undefined }));
  }

  async function enviar(e) {
    e.preventDefault();
    setErroGeral("");
    const novos = validarAtividade(form);
    setErros(novos);
    if (Object.keys(novos).length) {
      setTentativas((t) => t + 1);
      return;
    }

    setEnviando(true);
    try {
      const nova = await cadastrarAtividade(montarPayloadAtividade(form), {
        aoDemorar: () => setDemorando(true),
      });
      aoCadastrar(nova);
      // mantém competência, sub-trilha, nível e tempo: é comum cadastrar várias seguidas
      setForm((f) => ({ ...f, nome: "", instrucao: "" }));
    } catch (err) {
      setErroGeral(err.message);
    } finally {
      setEnviando(false);
      setDemorando(false);
    }
  }

  const ligacao = (campo) => ({
    "aria-invalid": Boolean(erros[campo]),
    "aria-describedby": erros[campo] ? `${campo}-erro` : undefined,
  });
  const habilidades = form.competenciaId ? habilidadesDe(form.competenciaId) : [];
  const bloqueado = carregando || Boolean(erroCatalogo);

  return (
    <section className="admin-cartao admin-formulario" aria-labelledby="admin-form-titulo">
      <h2 id="admin-form-titulo" className="admin-cartao-titulo">
        <IconeConfiguracoes className="admin-icone" />
        Registrar nova tarefa prática
      </h2>

      <form ref={formRef} onSubmit={enviar} noValidate>
        <fieldset className="admin-grupo" disabled={enviando}>
          <Campo id="nome" rotulo="Título da tarefa" erro={erros.nome}>
            <input
              id="nome"
              name="nome"
              maxLength={NOME_MAX}
              autoComplete="off"
              placeholder="Ex.: Comunicação não violenta em reuniões"
              value={form.nome}
              onChange={atualizar}
              {...ligacao("nome")}
            />
          </Campo>

          <Campo id="competenciaId" rotulo="Competência (soft skill)" erro={erros.competenciaId}>
            <select
              id="competenciaId"
              name="competenciaId"
              value={form.competenciaId}
              onChange={atualizar}
              disabled={bloqueado}
              {...ligacao("competenciaId")}
            >
              <option value="">{carregando ? "Carregando…" : "Selecione a competência"}</option>
              {competencias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="habilidadeId" rotulo="Sub-trilha" erro={erros.habilidadeId}>
            <select
              id="habilidadeId"
              name="habilidadeId"
              value={form.habilidadeId}
              onChange={atualizar}
              disabled={bloqueado || !form.competenciaId}
              {...ligacao("habilidadeId")}
            >
              <option value="">
                {form.competenciaId ? "Selecione a sub-trilha" : "Escolha antes a competência"}
              </option>
              {habilidades.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nome}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="nivel" rotulo="Nível" erro={erros.nivel}>
            <select
              id="nivel"
              name="nivel"
              value={form.nivel}
              onChange={atualizar}
              disabled={bloqueado}
              {...ligacao("nivel")}
            >
              <option value="">Selecione o nível</option>
              {niveis.map((n) => (
                <option key={n.id} value={n.ordem}>
                  Nível {n.ordem}
                  {n.nome ? ` · ${n.nome}` : ""}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="tempo" rotulo="Tempo estimado (duração)" erro={erros.tempo}>
            <select id="tempo" name="tempo" value={form.tempo} onChange={atualizar} {...ligacao("tempo")}>
              <option value="">Selecione o tempo</option>
              {OPCOES_TEMPO.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="instrucao" rotulo="Instrução / descrição da atividade" erro={erros.instrucao}>
            <textarea
              id="instrucao"
              name="instrucao"
              rows={4}
              placeholder="Ex.: Escreva uma mensagem de feedback construtivo aplicando técnicas de escuta ativa e validação do ponto de vista da outra pessoa."
              value={form.instrucao}
              onChange={atualizar}
              {...ligacao("instrucao")}
            />
          </Campo>
        </fieldset>

        {erroGeral && (
          <p className="aviso aviso-erro" role="alert">
            {erroGeral}
          </p>
        )}

        {enviando && demorando && (
          <p className="aviso aviso-espera" role="status">
            Conectando ao servidor. Se ele estava parado, pode levar até 1 minuto…
          </p>
        )}

        <button type="submit" className="botao-primario admin-enviar" disabled={enviando || bloqueado} aria-busy={enviando}>
          {enviando && <span className="spinner" aria-hidden="true" />}
          {enviando ? "Cadastrando…" : "Cadastrar e publicar tarefa"}
        </button>
      </form>
    </section>
  );
}
