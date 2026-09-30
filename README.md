# Front-end: Capacitação 4.0 (Projeto Espelho)

Front-end em React + Vite. Telas de login e cadastro integradas à API Flask (SCRUM-60).

## Rodando

Pré-requisito: Node 18+ e o backend Flask rodando em `http://localhost:5000`.

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Em desenvolvimento, as chamadas para `/api` são repassadas ao backend pelo proxy do Vite (`vite.config.js`). Para apontar para outro servidor, copie `.env.example` para `.env` e preencha `VITE_API_BASE`.

## Estrutura

```
src/
  services/api.js        cliente HTTP (fetch, token JWT, tratamento de erro)
  services/auth.js       rotas /api/auth/register e /api/auth/login
  context/AuthContext.jsx estado de login compartilhado (useAuth)
  components/            Campo, Selecao, RotaProtegida
  constants/perfil.js    opções dos campos de perfil do cadastro
  pages/                 Login, Cadastro, Home (placeholder)
  styles/global.css      tokens de cor e estilo
```

## Pendências

- **Visual:** cores e layout em `styles/global.css` são provisórios. Ajustar conforme o Figma.
- **Opções do cadastro:** `constants/perfil.js` tem só os valores que aparecem nos testes do backend. Completar com a documentação das rotas (SCRUM-80).
- **Home:** placeholder até o layout ser aprovado (SCRUM-78).
- O front HTML anterior foi movido para `legacy/`.
