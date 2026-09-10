# Strategic Blueprint

> Focus on the **what** and **why**. The code will follow.

**Hard rule**: AI agents must not edit this file and must not draft paste-ready content for it.

## The Problem
O jogo precisa trocar as letras X e O por cachorro e gato

## Steps
- Atualizar script.js: mapear CAT = 'cat' e DOG = 'dog' (substituir toLowerCase())
- Atualizar index.html: mudar "Player X's turn" para "🐱's turn" (ou "Cat's turn")
- Atualizar style.css: criar classes .cat e .dog (remover .x e .o)
- Atualizar game.test.js: usar constantes CAT/DOG



## Success Looks Like
-  jogo mostra gato e cachorro, testes passam, navegador exibe corretamente 

## Notes
- Na tarefa 2 eu fiz uma refatoracao da tarefa 1

antes
setStatus(`${result.winner === CAT ? '🐱' : '🐶'} wins!`, 'win');
setStatus(`${state.current === CAT ? '🐱' : '🐶'}'s turn`);


depois
setStatus(`${result.winner} wins!`, 'win');
setStatus(`${state.current}'s turn`);


---
**⚠️ HUMAN ONLY**: This file is your strategic space. AI agents must not edit it.