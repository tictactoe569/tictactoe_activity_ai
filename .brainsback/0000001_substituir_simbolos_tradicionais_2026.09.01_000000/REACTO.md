# Proof of Mastery (REACTO)

> Explain it to prove you own it.

**Hard rule**: AI agents must not edit this file and must not draft paste-ready content for it.

## R — The Problem
_Why is this change necessary?_
Era uma das demandas do cliente, o X e o O deveriam ser trocados pelos emojis de gato e cachorro.

## E — Examples
_One happy path, one edge case._

- **Input**: Clicar em uma celula
  **Output**: Aparece o emoji respectivo do jogador atual

- **Input**: Clicar em uma celula após o fim do jogo
  **Output**: nada acontece (como deveria)

## A — Approach
_High-level strategy._

A estrategia implementada foi de não mexer em nada na lógica interna do jogo de detecção de vitória, passagem de turnos e etc. O que ocorreu é que visualmente quando o jogo escreveria um X, ele troca por um emoji de gato. Assim a troca é apenas visual e não precisa de mais esforço por parte minha ou do agente

## C — Code
_Interesting patterns or trade-offs._

Foram adicionadas duas constantes CAT e DOG que guardam os emojis respectivos em script.js. A função que renderiza o X e o O simplesmente troca eles pelos emojis armazenados nas constantes. A função setStatus() que cuida dos turnos também foi modificada. O objeto symbolClass serve para converter de maneira rapida nos momentos onde o operador ternário não é usado

## T — Tests
_How are we verifying this?_

Principalmente visual pelo desenvolvedor. Os testes antigos continuaram rodando com sucesso e também devem ser verificados, mas por ser uma mudança visual mais do que de lógica, um check visual do desenvolvedor costuma ser o suficiente.

## O — Optimization
_Complexity checks (sometimes don't apply)._

Nada foi refatorado ou otimizado. Mantive a lógica interna como X e O para não correr risco de gerar algum problema por conta de encodings diferentes ou coisas do tipo