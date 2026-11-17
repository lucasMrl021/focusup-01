# FocusUp — código do projeto

App mobile que ajuda adolescentes a controlar o tempo de tela e focar nos estudos com gamificação, sem bloqueios.
Alunos: Lucas Meirelles, Emanuel Nunes e Danyel Franca.

```
focusup/
├── focusup-api/        Backend: Spring Boot 3 (Java 17) + MySQL, API REST com JWT
├── focusup-app/        Frontend: React Native com Expo (TypeScript)
└── docker-compose.yml  Banco MySQL pronto para desenvolvimento
```

## 1. Como rodar

### Pré-requisitos
- Java 17 ou mais novo e Maven 3.9+ (ou abra `focusup-api` no IntelliJ, que já traz o Maven)
- Docker Desktop (para o MySQL) ou um MySQL 8 instalado
- Node.js 20 ou mais novo
- App **Expo Go** no celular (Android ou iOS), no mesmo Wi-Fi do computador

### Banco de dados
```bash
docker compose up -d
```
Cria o banco `focusup` com usuário e senha `focusup`. As tabelas são criadas sozinhas quando a API sobe.
Sem Docker: crie o banco no seu MySQL e ajuste `DB_URL`, `DB_USER` e `DB_PASSWORD`.

### Backend (API)
```bash
cd focusup-api
mvn spring-boot:run
```
A API sobe em `http://localhost:8080`. Teste: `http://localhost:8080/api/saude` responde `{"status":"ok"}`.

Variáveis que podem ser trocadas: `DB_URL`, `DB_USER`, `DB_PASSWORD` e `JWT_SECRET` (mínimo de 32 caracteres; troque em produção).

### Frontend (app)
```bash
cd focusup-app
npm install
npx expo install --fix     # alinha as versões das bibliotecas com o Expo SDK instalado
npx expo start
```
Leia o QR code com o Expo Go. O app descobre sozinho o IP do computador e chama a API na porta 8080.
Se não conectar, libere a porta 8080 no firewall ou crie um `.env` com `EXPO_PUBLIC_API_URL` (veja `.env.example`).
Para abrir no navegador: `npx expo start --web`.

## 2. Testes

| Onde | Comando | O que cobre |
| --- | --- | --- |
| Backend | `cd focusup-api && mvn test` | 25 testes de regras (nível, sequência, pontos, conquistas) + 33 testes de integração dos endpoints, com banco H2 em memória e relógio controlado |
| App | `cd focusup-app && npm test` | Formatação, validações, cliente da API, componentes do design system e as telas de Login e Sessão ativa |
| App | `npm run typecheck` | Checagem de tipos do TypeScript |

Os testes de integração simulam o tempo: uma sessão de 25 min, 3 e 7 dias seguidos e a expiração do login em 7 dias rodam em segundos.

## 3. Requisitos no código

| Requisito | Backend | App |
| --- | --- | --- |
| RF01 Cadastro e autenticação | `AuthService`, `JwtService`, `SegurancaConfig` | `CadastroScreen`, `LoginScreen`, `AuthContext` (token guardado no SecureStore) |
| RF02 Perfil | `PerfilService` | `PerfilScreen`, `EditarPerfilScreen` (foto pela câmera ou galeria) |
| RF03 Metas | `MetaService`, `ProgressoService.progressoDaMeta` | `MetasScreen`, `MetaFormScreen`, `CartaoMeta` |
| RF04 Sessões de foco | `SessaoService` (15, 25, 45 ou 60 min; conclusão só depois do tempo) | `DuracaoScreen`, `SessaoAtivaScreen` (tela acesa, sem pausa, sem barra de abas) |
| RF05 Pontos e níveis | `rules/Pontuacao`, `rules/Niveis` | `CartaoNivel`, `SessaoConcluidaScreen` |
| RF06 Conquistas e sequências | `rules/Sequencias`, `rules/RegrasConquista`, `domain/Conquista` | `SemanaSequencia`, `Insignia`, `ConquistasView` |
| RF07 Histórico e estatísticas | `ProgressoService.estatisticas`, `SessaoService.historico` | `EstatisticasView` (gráfico com linha da meta), `HistoricoView` |
| RF08 Social e ranking | `SocialService` | `RankingScreen` (pódio), `AdicionarAmigoScreen` |
| RNF01 UX/UI | — | Design system da Parte 3: tokens em `src/theme/tokens.ts`, fontes Unbounded e Lexend, tema claro e escuro |
| RNF02 Desempenho | Uma chamada por tela (`/api/inicio` traz tudo de Início) | Tempo limite de 10 s e “Salvando sua sessão…” |
| RNF03 Android e iOS | — | Expo / React Native |
| RNF04 Segurança | Senha com BCrypt, JWT, rotas protegidas | Token no armazenamento seguro do celular; use HTTPS em produção |
| RNF05 Camadas e integridade | `web` → `service` → `repository` → MySQL com chaves estrangeiras e restrições únicas | — |

## 4. Endpoints da API

Todos, menos `/api/auth/*` e `/api/saude`, exigem o cabeçalho `Authorization: Bearer <token>`. Erros voltam como `{"mensagem": "..."}`.

| Método | Caminho | Uso |
| --- | --- | --- |
| POST | `/api/auth/cadastro` | Criar conta `{nome, email, senha}` → `{token, usuario}` |
| POST | `/api/auth/login` | Entrar `{email, senha}` → `{token, usuario}` |
| GET / PUT | `/api/perfil` | Ver ou editar `{apelido, idade, serie, foto}` |
| GET | `/api/inicio` | Tudo da tela Início: nível, sequência, meta de hoje, últimas sessões |
| GET / POST | `/api/metas` | Listar ou criar `{tipo: DIARIA|SEMANAL, minutosAlvo}` |
| PUT / DELETE | `/api/metas/{id}` | Editar ou excluir |
| POST | `/api/sessoes` | Iniciar `{duracaoMinutos}` |
| POST | `/api/sessoes/{id}/concluir` | Concluir: pontos, nível, sequência, meta e conquistas novas |
| POST | `/api/sessoes/{id}/encerrar` | Encerrar antes do fim (sem pontos) |
| GET | `/api/sessoes?limite=50` | Histórico |
| GET | `/api/estatisticas?periodo=SEMANA|MES` | Minutos por dia, total e sessões |
| GET | `/api/conquistas` | Insígnias, nível e sequência |
| GET | `/api/ranking` | Usuário e amigos por pontos |
| GET | `/api/amigos/busca?q=` | Buscar por apelido ou e-mail |
| POST | `/api/amigos/{id}` | Adicionar amigo |

## 5. Decisões tomadas onde os requisitos estavam em aberto

- **Nível:** o nível *n* começa em 125 × *n* × (*n* − 1) pontos (0, 250, 750, 1.500, 2.500…). Cada sessão vale 25 pontos.
- **Constância:** ao completar 7, 14, 21… dias seguidos, a primeira sessão do dia dá +100 pontos de bônus.
- **Sequência:** conta dias com pelo menos uma sessão concluída. Quem ainda não estudou hoje mantém a sequência de ontem.
- **Semana:** vai de domingo a sábado. As estatísticas de “Semana” e “Mês” mostram os últimos 7 e 30 dias.
- **Metas:** no máximo uma diária e uma semanal por pessoa. A meta semanal conta desde domingo.
- **Amizade:** sem aceite e nos dois sentidos (premissa da Parte 2).
- **Sessão encerrada antes do fim:** não dá pontos e não bloqueia nada. Não há pausa.
- **Conclusão da sessão:** o servidor só aceita depois que o tempo escolhido passou (tolerância de 10 s), para ninguém ganhar pontos sem focar.
- **Logout:** o app apaga o token guardado. O token também expira em 7 dias.
- **Foto do perfil:** guardada no banco como imagem em base64, reduzida pelo app. Em produção, o ideal é um serviço de arquivos.
- **Recuperação de senha:** fora do escopo, como na Parte 2.
