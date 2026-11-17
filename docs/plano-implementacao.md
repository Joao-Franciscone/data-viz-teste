# Plano de Implementação — Cadastro e Associação de Espécies

Resumo: implementar painel para cadastrar espécies, associá-las a aquários e listar/filtrar seguindo docs/modelo-especificacao.md e padrões em docs/AGENTS.md. Não implementar, apenas planejar.

1. Arquivos a criar ou alterar

- Criar:
  - public/dashboard/especies.html        # UI do painel de espécies
  - public/css/especies.css               # estilos seguindo padrão da dashboard
  - public/js/especies.js                 # lógica front-end: fetch, validações, UI
  - src/routes/especiesRoute.js           # rotas HTTP (GET list, POST create, GET filtros)
  - src/controllers/especiesController.js # validação de entrada e regras de negócio
  - src/models/especiesModel.js           # queries SQL (insert, select com filtros)
  - src/models/aquariosModel.js (adicionar funções se necessário) # buscar aquários para select

- Alterar:
  - src/app.js                            # registrar novo router (import + app.use)
  - public/dashboard/index.html (opcional) # link para o novo painel

2. Componentes

- Front-end:
  - FormEspecie: input nome, select aquário, botão cadastrar
  - ListaEspecies: tabela com colunas (id, nome, aquário, tipo_agua, tamanho)
  - Filtros: selects/inputs para tipo de água, tamanho do aquário, aquário
- Back-end:
  - Router /api/especies
  - Controller: validar campos, checar duplicidade, checar compatibilidade água
  - Model: SQL para inserir, buscar com filtros, buscar por nome
  - DB: conexões via src/database/config.js (padrão existente)

3. Fluxo (end-to-end)

1) Usuário abre public/dashboard/especies.html
2) Página solicita lista de aquários (/api/aquarios) para popular select
3) Usuário popula nome e seleciona aquário; ao submeter, front-end valida campos obrigatórios
4) Front-end faz POST /api/especies com payload { nome, idAquario }
5) Controller recebe: valida campos, normaliza nome, checa duplicidade (model), obtém tipo do aquário (model aquarios)
6) Se tipo incompatível => responder 400 com mensagem clara; else inserir via model
7) Após sucesso, front-end atualiza lista chamando GET /api/especies?filtros...

4. Regras de negócio (detalhadas)

- Nome único: comparar nomes normalizados (trim, lower, remover diacríticos) no banco antes de inserir.
- Compatibilidade de água: cada espécie terá um campo requerido 'tipo_agua_preferido' (se não houver, validar apenas com o aquário). Ao associar, checar tipo do aquário (do banco) contra preferência; bloquear associação incompatível.
- Campos obrigatórios: nome e aquário devem estar preenchidos.
- Filtros: permitir filtrar por tipo_agua do aquário, tamanho (>=, <= ou categorias) e id do aquário.

5. Decisões técnicas e justificativas

- Onde armazenar dados das espécies: criar tabela 'especies' (se não existir) com colunas id, nome_normalizado, nome_original, id_aquario, tipo_agua_preferido (nullable), criado_em. Justificativa: consistência e consultas eficientes.
- Normalização de nome: aplicar lower + NFKD + remoção de diacríticos e espaços múltiplos para evitar duplicidade por variações.
- Validações: duplicidade e compatibilidade no back-end (fonte de verdade). Front-end revalida para UX, mas não substitui back-end.
- Reusar models/arquitetura existente: seguir padrão src/models -> controllers -> routes -> database/config.js conforme AGENTS.md.
- Linguagem e padrões: JavaScript com var/const conforme convenção do projeto; comentários em pt-BR.
- Não introduzir novas bibliotecas sem aprovação; usar funções nativas para normalização (String.normalize) ou simples utilitários escritos localmente.

6. Etapas numeradas e como validar cada uma

1) Criar rotas e controllers mínimos
   - Tarefas: adicionar src/routes/especiesRoute.js e src/controllers/especiesController.js; registrar em src/app.js
   - Validação: rodar servidor (npm run dev) e acessar /api/especies (GET) retorna 200 e JSON vazio/array

2) Implementar model de leitura de aquários
   - Tarefas: adicionar função getAllAquarios em src/models/aquariosModel.js ou complementar existente
   - Validação: chamar rota /api/aquarios retorna lista com campos id, tipo_agua, tamanho

3) Implementar endpoint de listagem de espécies com filtros
   - Tarefas: criar src/models/especiesModel.js com função listar(filtros) e rota GET /api/especies?tipo_agua=&tamanho=&idAquario=
   - Validação: inserir alguns registros de teste direto no DB e verificar que GET retorna resultados corretos para cada filtro

4) Implementar verificação de duplicidade e compatibilidade no controller
   - Tarefas: controller deve usar modelo para buscar por nome_normalizado e buscar aquário por id para checar tipo_agua
   - Validação: tentar POST com nome duplicado => resposta 409 (ou 400) com mensagem; tentar POST com aquário incompatível => 400 com mensagem específica

5) Implementar insert no model e retorno consistente
   - Tarefas: model.insereEspecie(payload) e retornar id inserido
   - Validação: POST válido retorna 201 com objeto criado { id, nome, idAquario }, e banco contém o registro

6) Implementar front-end: formulário, validações, chamadas fetch
   - Tarefas: public/dashboard/especies.html + public/js/especies.js + estilos
   - Validação: abrir página, preencher formulário e ver mensagens de erro do cliente; em sucesso a tabela atualiza sem recarregar

7) Implementar listagem e filtros no front-end
   - Tarefas: componentes de filtro que chamam GET /api/especies com query params e renderizam tabela
   - Validação: aplicar filtros na UI e confirmar que os resultados correspondem ao backend

8) Testes de integração manuais e critérios de aceitação
   - Tarefas: seguir casos de teste abaixo
   - Validação (aceitação):
     - CA1: cadastrar espécie com nome único => sucesso; tentar cadastrar novamente => rejeição por duplicidade
     - CA2: filtrar por tipo de água/tamanho/aquário => resultados corretos
     - CA3: UI segue paleta e padrões (inspeção visual) e todos os controles existem

7. Casos de teste sugeridos (rápidos)

- CT1: Criar espécie A no aquário de água doce => sucesso
- CT2: Criar espécie A novamente => falha por duplicidade
- CT3: Criar espécie B e associar a aquário de água salgada se incompatível => falha com mensagem
- CT4: Listar espécies e aplicar filtro tipo_agua=doce => somente doces
- CT5: UI: acessar página, preencher e limpar formulário, verificar mensagens de validação

8. Riscos e mitigação

- Risco: alteração de esquema de DB não autorizada. Mitigação: propor mudanças ao responsável e documentar DDL; implementar só após aprovação.
- Risco: inconsistência entre nomes existentes em planilhas. Mitigação: fornecer rotina offline de import/normalização (fora de escopo) e alertar equipe.

9. Estimativa de trabalho (alto nível)

- Backend (rotas, controllers, models, DB DDL): 1-2 dias
- Frontend (HTML/CSS/JS, UX): 1-2 dias
- Testes e ajustes: 0.5-1 dia

Observação final: todas as alterações devem seguir os padrões descritos em docs/AGENTS.md; qualquer desvio (nova tabela, dependência) precisa de aprovação prévia.
