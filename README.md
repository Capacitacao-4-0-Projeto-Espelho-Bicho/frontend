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
  components/            LayoutAuth, PainelCeu, Campo, IconesSociais, RotaProtegida
  assets/                imagens (cérebro do painel)
  constants/perfil.js    opções dos campos de perfil do cadastro
  pages/                 Login, Cadastro, Home
  styles/home.css        estilo da Home (Figma "HOME PAGE", SCRUM-78)
  assets/home/           trilha e ícones exportados do Figma da Home
  styles/global.css      tokens de cor e estilo
```

## Pendências

- **Opções do cadastro:** os valores enviados em `constants/perfil.js` seguem o Figma. Confirmar com a documentação das rotas (SCRUM-80).
- **Home:** montada a partir do Figma (SCRUM-78). Atividades, notificações, histórico, configurações e busca mostram "em breve" porque o backend ainda não tem essas rotas. O nome do usuário vem do JWT ou do e-mail do login, até existir uma rota de perfil.
