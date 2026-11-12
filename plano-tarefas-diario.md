# Diário de Pensamentos – Plano de tarefas do início ao fim

Nome provisório do projeto: **ThoughtJournal**
**Âmbito do MVP:** registar pensamentos (título, data, contexto, intensidade, descrição), acrescentar reflexões com etiquetas, histórico com filtros e exportação de vários pensamentos para PDF. Um só utilizador, sem autenticação.

**Stack:** ASP.NET Core (.NET 10) + InertiaCore + React + TypeScript + MUI + Vite · EF Core + PostgreSQL (Docker) · QuestPDF · xUnit · GitHub Actions.

---

## Fase 0 – Preparação (≈ 1 h)

- [x] **0.1** Escolher o nome final do projeto.
- [x] **0.2** Criar o repositório público no GitHub com `README.md`, licença MIT e `.gitignore` para Visual Studio/.NET.
- [x] **0.3** Juntar ao `.gitignore` as pastas do frontend: `node_modules/`, `wwwroot/build/` (ou a pasta de saída do Vite que usares).
- [x] **0.4** Decidir a convenção de commits. Sugestão: *Conventional Commits* (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).

**Pronto quando:** o repositório existe, o quadro tem as issues e o primeiro commit está feito.

---

## Fase 1 – Ambiente de desenvolvimento (≈ 1 h)

- [x] **1.1** Instalar ou confirmar o **.NET 10 SDK**: `dotnet --version`.
- [x] **1.2** Instalar ou confirmar o **Node.js LTS**: `node --version` e `npm --version`.
- [x] **1.3** Instalar ou confirmar o **Docker Desktop**: `docker --version`.
- [x] **1.4** Instalar a ferramenta do EF Core: `dotnet tool install --global dotnet-ef`.
- [x] **1.5** Abrir o projeto no IDE que preferires (Rider, Visual Studio ou VS Code).

**Pronto quando:** todos os comandos acima devolvem uma versão.

---

## Fase 2 – Estrutura da solução (≈ 2–3 h)

Estrutura recomendada (Clean Architecture leve, três projetos e testes):

```
ThoughtJournal.sln
src/
  ThoughtJournal.Domain/          entidades e regras de negócio (sem dependências)
  ThoughtJournal.Infrastructure/  EF Core, PostgreSQL, geração de PDF
  ThoughtJournal.Web/             ASP.NET Core + InertiaCore + React (ClientApp)
tests/
  ThoughtJournal.Domain.Tests/
  ThoughtJournal.Web.Tests/       testes de integração (Fase 10)
docs/adr/
docker-compose.yml
```

- [ ] **2.1** Criar a solução: `dotnet new sln -n ThoughtJournal`.
- [ ] **2.2** Criar `ThoughtJournal.Domain` (`dotnet new classlib`).
- [ ] **2.3** Criar `ThoughtJournal.Infrastructure` (`dotnet new classlib`) com referência ao Domain.
- [ ] **2.4** Criar `ThoughtJournal.Web` (`dotnet new mvc`) com referência ao Domain e ao Infrastructure.
- [ ] **2.5** Criar `ThoughtJournal.Domain.Tests` (`dotnet new xunit`) com referência ao Domain.
- [ ] **2.6** Juntar todos os projetos à solução (`dotnet sln add ...`).
- [ ] **2.7** Em `Web`, instalar o pacote NuGet do InertiaCore e configurá-lo no `Program.cs` (serviços, middleware e Vite helper), como fizeste nos vídeos.
- [ ] **2.8** Criar a pasta `ClientApp` com Vite + React + TypeScript.
- [ ] **2.9** Instalar no frontend: `@inertiajs/react`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/x-date-pickers` e `dayjs`.
- [ ] **2.10** Configurar o `vite.config.ts` para gerar os ficheiros em `wwwroot` e o ponto de entrada da app Inertia (`createInertiaApp` com resolução de páginas em `Pages/`).
- [ ] **2.11** Criar o layout base em React (`AppLayout`): barra de topo com o nome da app e as ligações "Pensamentos" e "Etiquetas".
- [ ] **2.12** Criar uma página `Pages/Home.tsx` e uma ação no controlador que a devolve com `Inertia.Render`.
- [ ] **2.13** Correr a app e confirmar que a página React aparece servida pelo ASP.NET Core.
- [ ] **2.14** Configurar o tema MUI (cores, tipografia) num ficheiro `theme.ts`.

**Pronto quando:** `dotnet run` abre uma página React dentro do layout, sem erros na consola.

---

## Fase 3 – Base de dados em Docker (≈ 1 h)

- [ ] **3.1** Criar `docker-compose.yml` com um serviço `postgres` (imagem oficial, volume persistente, porta 5432).
- [ ] **3.2** Pôr a palavra-passe da base de dados num ficheiro `.env` e acrescentar `.env` ao `.gitignore`. Criar um `.env.example` sem valores reais.
- [ ] **3.3** Guardar a connection string de desenvolvimento com `dotnet user-secrets` no projeto Web (não no `appsettings.json`).
- [ ] **3.4** `docker compose up -d` e confirmar que o PostgreSQL está a correr.

**Pronto quando:** consegues ligar-te à base de dados (por exemplo com o DBeaver ou o terminal do Rider).

---

## Fase 4 – Domínio com testes primeiro (≈ 4–5 h)

Escreve primeiro o teste, vê-o falhar e só depois implementa.

### 4.1 Entidade `Thought` (raiz do agregado)
- [ ] **4.1.1** Propriedades: `Id`, `Title`, `OccurredAt`, `Context`, `Intensity`, `Description`, `CreatedAt`, `UpdatedAt` e a coleção `Reflections` (só de leitura para fora).
- [ ] **4.1.2** Construtor ou método de fábrica `Thought.Create(...)` que valida tudo.
- [ ] **4.1.3** Método `Update(...)` para editar título, data, contexto, intensidade e descrição.
- [ ] **4.1.4** Método `AddReflection(content, tags, now)`.
- [ ] **4.1.5** Métodos `EditReflection(...)` e `RemoveReflection(...)`.

### 4.2 Entidade `Reflection`
- [ ] **4.2.1** Propriedades: `Id`, `ThoughtId`, `Content`, `CreatedAt`, `UpdatedAt`, `Tags`.
- [ ] **4.2.2** Só pode ser criada através de `Thought.AddReflection` (construtor `internal`).

### 4.3 Entidade `Tag`
- [ ] **4.3.1** Propriedades: `Id`, `Name`, `NormalizedName` (minúsculas, sem espaços nas pontas).
- [ ] **4.3.2** Método de fábrica que normaliza o nome.

### 4.4 Testes xUnit (um por regra)
- [ ] Criar um pensamento válido funciona.
- [ ] Título vazio ou só com espaços é rejeitado.
- [ ] Título com mais de 120 caracteres é rejeitado.
- [ ] Intensidade abaixo de 0 ou acima de 10 é rejeitada.
- [ ] Descrição vazia é rejeitada (decide se o contexto é opcional e testa).
- [ ] Data do pensamento no futuro é rejeitada.
- [ ] Acrescentar uma reflexão aumenta a coleção e define `CreatedAt`.
- [ ] Reflexão com conteúdo vazio é rejeitada.
- [ ] Reflexão com data anterior à do pensamento é rejeitada.
- [ ] Editar e remover uma reflexão funcionam; remover uma reflexão que não existe dá erro.
- [ ] Duas etiquetas com o mesmo nome em maiúsculas e minúsculas diferentes ("Oração" e "oração") têm o mesmo `NormalizedName`.
- [ ] A mesma etiqueta não aparece duas vezes na mesma reflexão.

- [ ] **4.5** Decidir como representas os erros de domínio: exceções próprias (`DomainException`) ou um tipo `Result`. Registar a escolha num ADR curto (`docs/adr/0001-domain-errors.md`).
- [ ] **4.6** Para as datas, usar um `TimeProvider` (já existe no .NET) em vez de `DateTime.Now`, para os testes controlarem o tempo.

**Pronto quando:** `dotnet test` passa com todas as regras cobertas.

---

## Fase 5 – Persistência com EF Core (≈ 3 h)

- [ ] **5.1** No Infrastructure, instalar `Npgsql.EntityFrameworkCore.PostgreSQL` e `Microsoft.EntityFrameworkCore.Design` (este também no Web).
- [ ] **5.2** Criar o `AppDbContext` com `DbSet<Thought>` e `DbSet<Tag>`.
- [ ] **5.3** Criar configurações Fluent API (uma classe `IEntityTypeConfiguration` por entidade):
  - [ ] `Thought`: tamanho máximo do título, intensidade obrigatória, relação 1:N com `Reflection` e eliminação em cascata.
  - [ ] Mapear a coleção privada de reflexões (backing field).
  - [ ] `Reflection` ↔ `Tag`: relação N:N com tabela de ligação.
  - [ ] `Tag`: índice único em `NormalizedName`.
- [ ] **5.4** Registar o `AppDbContext` no `Program.cs` com a connection string dos user-secrets.
- [ ] **5.5** Criar a primeira migração: `dotnet ef migrations add InitialCreate -p src/ThoughtJournal.Infrastructure -s src/ThoughtJournal.Web`.
- [ ] **5.6** Aplicar: `dotnet ef database update ...` e confirmar as tabelas na base de dados.
- [ ] **5.7** Criar um *seeder* de dados de demonstração **fictícios** (8–10 pensamentos com reflexões e etiquetas), que só corre em Development e só se a base estiver vazia.
- [ ] **5.8** Criar a classe `ThoughtService` (ou repositório) com os métodos: listar com filtros, obter por id com reflexões e etiquetas, criar, atualizar, apagar. Para as etiquetas, um método que reutiliza uma etiqueta existente ou cria uma nova.

**Pronto quando:** ao arrancar a app, a base tem os dados de demonstração.

---

## Fase 6 – Pensamentos: criar, ver, editar e apagar (≈ 5–6 h)

### Backend (`ThoughtsController`)
- [ ] **6.1** `GET /thoughts` → `Inertia.Render("Thoughts/Index", ...)` com a lista (título, data, intensidade, número de reflexões).
- [ ] **6.2** `GET /thoughts/create` → página do formulário.
- [ ] **6.3** `POST /thoughts` → valida, cria, redireciona para o detalhe; em caso de erro, devolve os erros de validação ao Inertia.
- [ ] **6.4** `GET /thoughts/{id}` → detalhe com reflexões e etiquetas; 404 se não existir.
- [ ] **6.5** `GET /thoughts/{id}/edit` e `PUT /thoughts/{id}` → editar.
- [ ] **6.6** `DELETE /thoughts/{id}` → apagar e redirecionar para a lista com mensagem de sucesso (flash).
- [ ] **6.7** Criar DTOs/ViewModels próprios para cada página. Não enviar entidades do domínio diretamente para o React.
- [ ] **6.8** Partilhar a mensagem flash e os erros com todas as páginas (shared props do Inertia).

### Frontend (React + MUI)
- [ ] **6.9** Tipos TypeScript para os props de cada página (`ThoughtListItem`, `ThoughtDetail`, etc.).
- [ ] **6.10** `Pages/Thoughts/Index.tsx`: lista em cartões ou tabela, com a intensidade visível (por exemplo, um `Chip` com cor), botão "Novo pensamento".
- [ ] **6.11** Componente `ThoughtForm` reutilizado em criar e editar, com `useForm` do Inertia:
  - [ ] Título (`TextField`)
  - [ ] Data e hora (`DateTimePicker`)
  - [ ] Contexto (`TextField` multilinha)
  - [ ] Intensidade (`Slider` de 0 a 10 com o valor visível)
  - [ ] Descrição (`TextField` multilinha grande)
  - [ ] Mostrar os erros de validação por campo e desativar o botão enquanto envia.
- [ ] **6.12** `Pages/Thoughts/Create.tsx` e `Pages/Thoughts/Edit.tsx`.
- [ ] **6.13** `Pages/Thoughts/Show.tsx`: todos os campos do pensamento e espaço reservado para as reflexões (Fase 7).
- [ ] **6.14** Apagar com diálogo de confirmação (`Dialog` do MUI).
- [ ] **6.15** Mostrar a mensagem flash num `Snackbar`.

**Pronto quando:** consegues criar, ver, editar e apagar um pensamento pela interface, com erros de validação visíveis.

---

## Fase 7 – Reflexões e etiquetas (≈ 4–5 h)

### Backend
- [ ] **7.1** `POST /thoughts/{id}/reflections` → acrescenta uma reflexão com etiquetas (nomes); cria as etiquetas que ainda não existem.
- [ ] **7.2** `PUT /thoughts/{id}/reflections/{reflectionId}` → editar.
- [ ] **7.3** `DELETE /thoughts/{id}/reflections/{reflectionId}` → remover.
- [ ] **7.4** `GET /tags` → página com a lista de etiquetas e quantas reflexões usam cada uma.
- [ ] **7.5** Mudar o nome de uma etiqueta e apagar etiquetas sem uso (opcional, se houver tempo).
- [ ] **7.6** Enviar a lista de etiquetas existentes para a página de detalhe (para sugestões).

### Frontend
- [ ] **7.7** Na página `Show`, lista de reflexões por ordem cronológica, cada uma com data e etiquetas (`Chip`).
- [ ] **7.8** Formulário para nova reflexão: texto multilinha + `Autocomplete` do MUI com `freeSolo` e `multiple`, para escolher etiquetas existentes ou escrever novas.
- [ ] **7.9** Editar uma reflexão no próprio sítio (o cartão passa a formulário) e apagar com confirmação.
- [ ] **7.10** `Pages/Tags/Index.tsx` com a lista de etiquetas.

**Pronto quando:** consegues acrescentar várias reflexões a um pensamento, com etiquetas novas e existentes.

---

## Fase 8 – Histórico com filtros (≈ 3 h)

- [ ] **8.1** Filtros na query string de `GET /thoughts`: `from`, `to`, `tag`, `minIntensity`, `maxIntensity`, `search` (título e descrição).
- [ ] **8.2** Aplicar os filtros na consulta EF Core (apenas os que vierem preenchidos).
- [ ] **8.3** Ordenação: mais recentes primeiro (e, opcionalmente, por intensidade).
- [ ] **8.4** Paginação (por exemplo, 10 por página) com total de resultados.
- [ ] **8.5** No React, barra de filtros (datas, etiqueta, intervalo de intensidade, pesquisa) que faz `router.get` com `preserveState` e `preserveScroll`, para não perder o estado.
- [ ] **8.6** Botão "Limpar filtros".
- [ ] **8.7** Componente de paginação (`Pagination` do MUI).
- [ ] **8.8** Mensagem simpática quando não há resultados.

**Pronto quando:** consegues filtrar por etiqueta e intervalo de datas, e o filtro mantém-se ao mudar de página.

---

## Fase 9 – Exportar para PDF (≈ 4 h)

- [ ] **9.1** No Infrastructure, instalar o **QuestPDF**. Confirmar as condições da licença comunitária e configurar a licença no arranque, como pede a documentação.
- [ ] **9.2** Criar a interface `IThoughtPdfExporter` (no Domain ou numa camada de aplicação) e a implementação `QuestPdfThoughtExporter` no Infrastructure.
- [ ] **9.3** Desenhar o documento:
  - [ ] Capa ou cabeçalho com o título "Thought Journal", a data de exportação e o número de pensamentos.
  - [ ] Um bloco por pensamento: título, data, intensidade, contexto, descrição.
  - [ ] As reflexões de cada pensamento, com data e etiquetas.
  - [ ] Rodapé com o número da página.
- [ ] **9.4** Ação `POST /thoughts/export` que recebe a lista de ids, carrega os pensamentos e devolve `File(bytes, "application/pdf", "thoughts-AAAA-MM-DD.pdf")`.
- [ ] **9.5** Validar: pelo menos 1 id; limite máximo (por exemplo, 20); ids que não existem dão erro.
- [ ] **9.6** No React, caixas de seleção na lista de pensamentos e um botão "Exportar PDF (n)" que só fica ativo com pelo menos um selecionado.
- [ ] **9.7** **Atenção ao Inertia:** um download de ficheiro não pode ser uma visita Inertia (o Inertia espera uma página, não um PDF). Faz o pedido com um `<form>` HTML normal (method POST, com o token antiforgery) ou com `fetch` + `Blob` + link temporário.
- [ ] **9.8** Botão "Exportar este pensamento" também na página de detalhe.
- [ ] **9.9** Testes: o exportador gera um PDF não vazio que começa com `%PDF`; com 3 pensamentos, o documento é gerado sem erro.

**Pronto quando:** escolhes 2 ou 3 pensamentos e descarregas um PDF legível.

---

## Fase 10 – Qualidade (≈ 3–4 h)

- [ ] **10.1** Criar `ThoughtJournal.Web.Tests` com `WebApplicationFactory` e **Testcontainers** para PostgreSQL.
- [ ] **10.2** Testes de integração mínimos:
  - [ ] Criar um pensamento pelo endpoint e confirmar que fica na base.
  - [ ] Pedido inválido devolve erros de validação.
  - [ ] Filtro por etiqueta devolve só os pensamentos certos.
  - [ ] Exportar devolve `application/pdf`.
- [ ] **10.3** `dotnet format` para o código C#.
- [ ] **10.4** ESLint + Prettier no frontend e `tsc --noEmit` para confirmar os tipos.
- [ ] **10.5** Rever acessibilidade básica: etiquetas nos campos, contraste, navegação por teclado.
- [ ] **10.6** Rever o comportamento em ecrã de telemóvel.

**Pronto quando:** todos os testes passam e não há erros de lint nem de tipos.

---

## Fase 11 – Docker e CI (≈ 3 h)

- [ ] **11.1** `Dockerfile` multi-stage para a app:
  - [ ] Etapa 1 (Node): `npm ci` e `npm run build` do frontend.
  - [ ] Etapa 2 (.NET SDK): `dotnet publish` em Release.
  - [ ] Etapa 3 (ASP.NET runtime): só os ficheiros publicados.
- [ ] **11.2** Acrescentar a app ao `docker-compose.yml`, para `docker compose up` arrancar tudo (app + PostgreSQL).
- [ ] **11.3** Aplicar as migrações no arranque em Development (ou documentar o comando).
- [ ] **11.4** Workflow `.github/workflows/ci.yml`, a correr em cada push e pull request:
  - [ ] Checkout
  - [ ] Setup .NET 10 e Node LTS
  - [ ] `npm ci`, lint, verificação de tipos e build do frontend
  - [ ] `dotnet restore`, `dotnet build`, `dotnet test` (os runners do GitHub têm Docker, por isso os testes com Testcontainers funcionam)
  - [ ] Construir a imagem Docker (sem publicar)
- [ ] **11.5** Badge do estado do CI no README.

**Pronto quando:** o CI fica verde no GitHub e `docker compose up` arranca a app completa.

---

## Fase 12 – Documentação e lançamento (≈ 4 h)

- [ ] **12.1** README em inglês:
  - [ ] O que é a app, numa frase, e para quem é.
  - [ ] Capturas de ecrã ou GIF (lista, detalhe com reflexões, PDF exportado).
  - [ ] Funcionalidades.
  - [ ] Stack.
  - [ ] Arquitetura: diagrama simples das camadas e do agregado `Thought` → `Reflection` → `Tag`.
  - [ ] Decisões principais: porquê um monólito com Inertia em vez de API REST + SPA; porquê o agregado; como são tratados os erros de domínio; porquê ainda não há autenticação.
  - [ ] Como correr localmente (com Docker e sem Docker).
  - [ ] Como correr os testes.
  - [ ] *Future work*: autenticação, evolução da intensidade ao longo do tempo, deploy público, modo escuro..
- [ ] **12.3** Rever o código uma última vez: nomes, código morto, comentários desnecessários.
- [ ] **12.4** Criar a tag `v1.0.0` e uma *Release* no GitHub com as notas.
- [ ] **12.5** Fixar (pin) o repositório no teu perfil do GitHub.
- [ ] **12.6** Acrescentar o projeto ao LinkedIn (secção Projetos) e, se couber, ao CV.
- [ ] **12.7** Gravar um vídeo de demonstração para o YouTube e escrever o post no LinkedIn com a ligação.

## Depois do MVP
- Autenticação com ASP.NET Core Identity e um dono por pensamento (migração EF Core).
- Gráfico da evolução da intensidade ao longo do tempo.
- Deploy público (só com dados de demonstração ou depois de existir autenticação).
- Modo escuro.
- Exportação de um intervalo de datas inteiro.

