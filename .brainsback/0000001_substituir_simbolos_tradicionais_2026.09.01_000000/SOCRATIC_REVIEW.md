# Socratic Review — Task 1

> Consolidado da revisão socrática realizada em 2026-09-08.

## Participant
- **Branch:** P2312672

## Veredito

**🟢 APROVADO** — O participante demonstrou domínio satisfatório sobre as alterações realizadas na Tarefa 1.

---

## Perguntas e Respostas

### Pergunta 1 — Sobre a Estratégia (Approach)
**Por que a substituição não foi simplesmente um "Ctrl+H" em todos os arquivos? O que exigiu ajustes além da troca de caracteres?**

**Resposta do participante:** Um emoji não é uma letra, logo não pode só substituir tudo e esperar que der certo. O emoji tem mais de 1 byte, logo na hora de separar, ia quebrar o caractere.

**Análise:** ✅ Correto. O participante compreende que emojis são multi-byte (*surrogate pairs*) e que operações como `split('')` precisam ser adaptadas com `Array.from()`.

---

### Pergunta 2 — Sobre a Geração de Classes CSS
**O código original usava `.toLowerCase()` para gerar a classe CSS. Por que não podíamos manter essa abordagem com emojis?**

**Resposta do participante:** O CSS não aceitaria o símbolo dos emojis como classe, então teve que fazer essa conversão.

**Análise:** ✅ Correto. `'🐱'.toLowerCase()` retorna `'🐱'`, e nomes de classe CSS com emojis são inválidos. A solução de mapear `'🐱' → 'cat'` e `'🐶' → 'dog'` foi a abordagem correta.

---

### Pergunta 3 — Sobre a Função `boardFrom`
**Se tivéssemos mantido `str.split('')`, o que aconteceria com a string `'🐱🐶🐱'`?**

**Resposta do participante:** Elas teriam sido quebradas por byte, fazendo os emojis sumirem ou dar erro.

**Análise:** ✅ Correto. `'🐱🐶🐱'.split('')` produziria 6 caracteres quebrados em vez de 3 emojis, causando falhas nos testes.

---

### Pergunta 4 — Sobre os Testes
**Quais cenários você verificou manualmente? Como sabe que os testes unitários continuam válidos?**

**Resposta do participante:** Testei manualmente a vitória de cada emoji e também o empate. Sei que os testes continuam válidos pois o HTML foi alterado e continua funcionando normalmente.

**Análise:** ✅ Correto. Os testes unitários foram atualizados com os novos valores (`'🐱'`/`'🐶'`) e a lógica permanece idêntica. Testes manuais confirmaram o funcionamento visual.

---

### Pergunta 5 — Sobre a Otimização
**Se implementássemos a escolha de emojis pelo jogador, que partes do código seriam afetadas?**

**Resposta do participante:** Provavelmente a parte de falar qual era o jogador atual, antes disso, no começo do jogo perguntar qual cada jogador iria querer usar.

**Análise:** ✅ Correto. Além de `script.js` (interface de seleção), seriam afetados `game.js` (valores dos jogadores) e `tests/game.test.js` (testes com novos valores). O mapeamento de classes CSS também precisaria ser dinâmico.

---

## Conclusão

O participante demonstrou compreensão clara de:
- A natureza multi-byte dos emojis e seu impacto em operações de string
- A incompatibilidade de emojis como seletores CSS
- A necessidade de adaptar funções como `split()` para `Array.from()`
- A importância de testar tanto automatizadamente quanto manualmente
- O escopo de impacto de futuras modificações no código

**Veredito Final: 🟢 APROVADO — Pode prosseguir para a Tarefa 2.**