# Titulo do documento

## 1. Contexto

A aquatech opera aquários com diferentes características, alguns de água doce e outros de salgada, o sistema web já possui de cadastro de empresas, usuários, aquários e os usuários possuem um acesso a um painel de gestão. Cada aquário mantém uma população de espécie específica e precisa seguir alguns parametros de qualidade para o bem-estar dos seres-vivos

As informações sobre as espécies estão espalhas em planilhas e conversas informais, gerando três problemas:

-- 1 - Espécies diferentes cadastradas com nomes iguais, dificultando saber se a espécie já existe.
-- 2 - Em algumas situações as espécies são associadas a um aquário com tipo de água incompatível, causando mortalidade e prejuízo
-- 3 -A equipe não consegue visualizar facilmente todas as espécies cadastradas nem filtrar por características importantes.

## 2. Objetivo

O objetivo é centralizar esse controle no sistema web já existente, permitindo a equipe cadastrar espécies, associar as espécies aos aquários e manter as informações atualizadas.

## 3. Escopo

- **Dentro do escopo:** Criar as funcionalidades que foram informadas no objetivo e contexto, e seguir o modelo de criação (docs/AGENTS.md) sobre o web-data-viz para a criação desse projeto

- **Fora do escopo:** : Criar novas funcionalidades fora do contexto e objetivo do projeto, refatorar as funcionalidades já existentes e não seguir o modelo de criação especificado (docs/AGENTS.md)

## 4. Funcionalidades

-- Input para inserção de novas espécies, captando o nome da espécie
-- Select para associar as espécies cadastradas aos aquários disponíveis
-- Verificar se o aquário é de água doce ou salgada e informar ao usuário através de um aviso
-- Botão para realizar o cadastro
-- Botão para listar os cadastros, contendo informações como nome da espécie, aquário cadastrado, id do cadastro e tipo de água do aquário
-- Criar um filtro para listar os cadastros, podendo ser filtrado por tipo de água, tamanho do aquário e aquário;

## 5. Regras de negócio

-- O sistema deverá validar se o nome da espécie já foi cadastrado anteriormente e evitar duplicidade
-- O sistema deverá validar se a espécie está sendo associada a um tipo de água incompatível
-- O sistema deve garantir o filtro especificado nas funcionalides
-- O sistema deverá validar se todas as informações foram preenchidas antes de executar os comandos para cadastro

## 6. Interface

A interface deve seguir o mesmo modelo de gráfico do painel de gestão do usuário, com a mesma paleta de cores, tamanho e tipo de fonte e padrão de tamanho de divs, inputs, selects e botões

## 7. Critérios de aceitação

- Critério de aceitação 1: Cadastro está sendo realizado corretamente sem duplicidade
- Critério de aceitação 2: Filtro está sendo executado corretamente
- Critério de aceitação 3: Painel de cadastro foi criado corretamente seguindo todos os padrões de interface, regra de negócio e funcionalidades.
