# Strategic Blueprint

> Focus on the **what** and **why**. The code will follow.

**Hard rule**: AI agents must not edit this file and must not draft paste-ready content for it.

## The Problem
Substituir o "X" e o "O" que aparecem na interface do jogo da velha pelos emojis '🐱' e '🐶'

## Steps
Alterar as funções em script.js nas quais há alguma menção aos caracteres "X" e "O" sendo renderizados na tela, substituindo os caracteres pelos emojis.
Como a lógica do game.js foi mantida, o problema se torna apenas uma questão do que exibir na tela.
As funções editadas foram:
- render ()
> Mapeia 'X' → '🐱' e 'O' → '🐶' no textContent das células do tabuleiro

- handleClick ()
> Mensagem de vitória: agora mostra Player 🐱 wins! ou Player 🐶 wins! dinamicamente
> Mensagem de turno: mostra Player 🐱's turn ou Player 🐶's turn

- restartGame ()
> Mensagem de reinício: também usa o emoji correto

- Também houve uma edição fora de qualquer função, a respeito do render inicial:
> Render inicial (linhas finais): mensagem inicial com Player 🐱's turn

Depois, tive que alterar o index.html também:
- A alteração se deu na Linha do <div class="status">
> Texto inicial de "Player X's turn" → "Player 🐱's turn"


## Success Looks Like
- O tabuleiro mostra 🐱 e 🐶 em vez de X e O
- As mensagens de status mostram os emojis corretos (vitória, turno, reinício)
- A lógica do jogo continua funcionando normalmente (jogadas, vitórias, empates)
- Os 31 testes unitários continuam passando
- O botão "New Game" reinicia corretamente com os emojis

## Notes
- A lógica em game.js não foi alterada — só a camada de interface
- Os testes unitários em game.test.js não precisaram ser modificados porque testam a lógica pura, não a interface
- As classes CSS (.x, .o) continuam funcionando porque o board interno ainda usa 'X' e 'O'

---
**⚠️ HUMAN ONLY**: This file is your strategic space. AI agents must not edit it.