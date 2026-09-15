# Socratic Review — Tarefa 1

> Registro da revisão socrática conduzida após a implementação da substituição dos símbolos `X` e `O` por 🐱 e 🐶.

## Veredito

**✅ APROVADO** — O desenvolvedor demonstrou domínio satisfatório sobre o código implementado, compreendendo as motivações técnicas, os trade-offs envolvidos e os impactos das alterações realizadas.

---

## Perguntas e Respostas

### Pergunta 1 — Sobre a lógica do jogo (`game.js`)

**P:** Por que `getNextPlayer` recebe o jogador atual como parâmetro em vez de alternar uma variável global?

**R:** "Porque é uma lógica mais simples, pois para determinar o próximo jogador basta vermos qual é o atual, que será o outro."

**Análise:** Correto. A função é pura (sem efeitos colaterais) — dado o mesmo input, produz o mesmo output. Isso facilita testes e evita bugs com estado global compartilhado.

---

### Pergunta 2 — Sobre o mapeamento de classes CSS (`script.js`)

**P:** Por que foi necessário criar o mapeamento `'🐱' → 'x'` e `'🐶' → 'o'` em vez de usar `toLowerCase()` como antes?

**R:** "Não funcionaria na maneira como era intencionado, uma vez que emojis não possuem caixa alta ou baixa, são apenas figuras."

**Análise:** Correto. Emojis não têm conceito de caixa alta/baixa. `'🐱'.toLowerCase()` retorna `'🐱'`, o que geraria uma classe CSS inválida como `.cell.🐱`. O mapeamento explícito foi a solução correta.

---

### Pergunta 3 — Sobre os testes (`tests/game.test.js`)

**P:** Por que `split('')` funciona para `'X'`/`'O'` mas quebra para `'🐱'`/`'🐶'`?

**R:** "Porque emojis são caracteres multi-byte, então o split quebraria os emojis, mas tratando eles como uma array de múltiplos bytes o comportamento se 'normaliza'."

**Análise:** Correto. `'🐱'.split('')` produz `['\uD83D', '\uDC31']` (2 caracteres surrogate), enquanto `Array.from('🐱')` produz `['🐱']` (1 elemento). A correção com `Array.from()` foi precisa.

---

### Pergunta 4 — Sobre o `style.css`

**P:** As classes `.cell.x` e `.cell.o` são uma dívida técnica?

**R:** "Sim, é uma dívida técnica, esses nomes ainda entendem uma implementação ultrapassada, que podem confundir um futuro desenvolvedor. Para melhorar isso eu alinharia o nome dessas classes com seus respectivos novos símbolos."

**Análise:** Correto. O desenvolvedor identificou corretamente a dívida semântica e propôs a solução adequada: renomear as classes para refletir os novos símbolos (ex: `.cell.cat` e `.cell.dog`).

---

### Pergunta 5 — Sobre o fluxo geral

**P:** Explique o caminho desde o clique até o símbolo aparecer na tela com a cor correta.

**R:** "Quando clicamos existe um listener que entende que o clique aconteceu e onde aconteceu, ele então verifica quem é o jogador da rodada e registra o respectivo emoji da rodada na casa assinalada, claro, entendendo que foi uma jogada válida (partida ainda ativa e casa desocupada)."

**Análise:** Correto, mas pode ser complementado. O fluxo completo é:
1. `click` → `handleClick(e)` detecta o índice via `dataset.index`
2. Valida se a célula está vazia e o jogo não acabou
3. `applyMove()` cria novo board com o símbolo do jogador atual
4. `render()` atualiza `textContent` e aplica a classe CSS (`x` ou `o`) via mapeamento
5. `checkWinner()` verifica se houve vitória/empate
6. `getNextPlayer()` alterna para o próximo jogador

---

## Conclusão

O desenvolvedor demonstrou compreensão sólida de:
- Funções puras vs. estado global
- Limitações de emojis como identificadores CSS
- Manipulação correta de strings multi-byte em JavaScript
- Identificação de dívida técnica e propostas de melhoria
- Fluxo completo do evento de clique até a renderização

**Status: ✅ Revisão concluída. Pode prosseguir para a Tarefa 2.**