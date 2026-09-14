# Proof of Mastery (REACTO)

> Explain it to prove you own it.

**Hard rule**: AI agents must not edit this file and must not draft paste-ready content for it.

## R — The Problem

Precisavamos trocar os simbolos no display do jogo da velha por emojis
## E — Examples

Por exemplo o X viraria 🐱 e o O viraria 🐶e ao invéz de falar que X ou O venceu teria que falar qual dos emojis venceram

## A — Approach
_High-level strategy._

Fazer com que render renderize o X como 🐱 e o O como 🐶, assim não teriamos que alterar muita coisa na lógica ou nos testes apenas mudar a maneira como render lê o tabuleiro

## C — Code
_Interesting patterns or trade-offs._

1) Essa primeira linha é responsável pela tradução dos X e Y da Matrix pelos em,ojis
const SYMBOL = { X: '🐱', O: '🐶' };


2) Na hora de renderizar apenas chamamos o symbol em cima do state.board ou do state current para representar os simbolos no jogo e a mensagem de turno/ vitoria respectivamente
cell.textContent = SYMBOL[state.board[i]] || '';

setStatus(`${SYMBOL[state.current]}'s turn`);

## T — Tests
_How are we verifying this?_
Os testes automáticos continuam passando (já que não alteramos nenhuma lógica), então para testar realmente fazemos testes práticos abrindo o jogo
## O — Optimization
_Complexity checks (sometimes don't apply)._
O maximo que essa implementação poderia ser aprofundada é talvez utilizar de dicionário para talvez adicionar mais simbolos, mas para essa implementação especifica me parece a mais otimizada