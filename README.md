# Front-end: Capacitação 4.0 (Projeto Espelho)

Front-end em React + Vite. Telas de login e cadastro integradas à API Flask (SCRUM-60).

## Rodando

Pré-requisito: Node 18+.

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Em desenvolvimento, as chamadas para `/api` são repassadas pelo proxy do Vite (`vite.config.js`) para a API no Render: `https://capacitacao-4-0-api.onrender.com` (documentação das rotas em `/dev`). Não precisa rodar o back-end no seu computador.

O Render gratuito dorme depois de 15 minutos sem uso. A primeira chamada pode levar até 1 minuto: o login e o cadastro mostram "Conectando ao servidor…" nesse caso, e a tela de login já manda uma chamada leve para acordá-lo assim que abre.

Para usar um back-end rodando no seu computador, crie um `.env.local` com:

```
VITE_API_ALVO=http://localhost:5000
```

`VITE_API_BASE` (no `.env`) só é necessário quando o front for publicado fora do Vite, para chamar a API direto. Nesse caso o back-end precisa liberar CORS para o domínio do front.

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
  components/Trilha.jsx  trilha da Home (caminho em SVG, nós e troféu clicáveis)
  components/IconesHome.jsx  ícones, nós e troféu da Home em SVG
  styles/global.css      tokens de cor e estilo
```

## Pendências

- **Opções do cadastro:** os valores enviados em `constants/perfil.js` seguem o Figma. A API aceita qualquer texto de até 30 caracteres nesses campos; a lista oficial ainda precisa ser fechada com o back-end.
- **CORS:** a API ainda não usa `flask-cors`. Em desenvolvimento não faz falta (o proxy do Vite chama a API pelo servidor), mas é necessário antes de publicar o front.
- **Home:** montada a partir do Figma (SCRUM-78). Atividades, notificações, histórico, configurações e busca mostram "em breve" porque o backend ainda não tem essas rotas. O nome do usuário vem do JWT ou do e-mail do login, até existir uma rota de perfil.
