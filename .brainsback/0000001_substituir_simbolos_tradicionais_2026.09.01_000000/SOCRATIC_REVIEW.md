# 🧠 Revisão Socrática — Tarefa 1

> **Agente Revisor**: GitHub Copilot
> **Data**: 2026-09-14
> **Tarefa**: Substituir símbolos tradicionais X/O por 🐱/🐶 na interface

---

## Perguntas e Respostas

### Pergunta 1 — Sobre a estratégia de separação

**Por que optamos por não alterar o `game.js` e manter a lógica com `'X'` e `'O'`?**

**Resposta do desenvolvedor:**
> Alterar o `game.js` significaria que futuras alterações de padrões de X e O necessitariam de alteração em todos os JS e nos testes, criando retrabalho considerável.

**Análise do revisor:** ✅ Correta. A separação entre lógica pura (`game.js`) e apresentação (`script.js`) segue o princípio da **responsabilidade única**. O `game.js` contém as regras do jogo — que independem de como os símbolos são exibidos. Os 31 testes unitários validam exatamente essa camada, e mantê-la inalterada garante que nenhum teste precise ser modificado.

---

### Pergunta 2 — Sobre a refatoração das constantes

**Você extraiu `symbol_X`, `symbol_O`, `markname_X`, `markname_O` para o topo do arquivo. Qual foi a motivação?**

**Resposta do desenvolvedor:**
> Constantes sempre no topo do arquivo é uma boa prática de código limpo. Se existissem mais variáveis desse tipo, uma tupla ou lista seriam ideais.

**Análise do revisor:** ✅ Correta. A extração para constantes no topo segue o princípio de **código limpo** — centraliza a configuração e evita "magic numbers/strings" espalhadas pelo código. A sugestão de evoluir para uma tupla/lista (ou um objeto/mapa) é pertinente caso o número de símbolos cresça.

---

### Pergunta 3 — Sobre os testes

**Se alguém no futuro alterar as constantes `symbol_X` e `symbol_O` no `script.js` para outros emojis, os testes ainda vão passar?**

**Resposta do desenvolvedor:**
> Sim, pois os testes rodam as funcionalidades de `game.js` que ainda interpretam X e O. A alteração foi no wrapper que faz interface com o frontend, que decodifica X e O nos padrões escolhidos.

**Análise do revisor:** ✅ Correta. Os testes em `game.test.js` importam as funções do `game.js` (`createInitialState`, `applyMove`, `checkWinner`, etc.) que operam exclusivamente com `'X'` e `'O'`. O `script.js` é apenas um consumidor dessas funções — qualquer mudança nas constantes de exibição não afeta a lógica testada.

---

### Pergunta 4 — Sobre o CSS

**Se trocarmos 🐱 por 🦊 e 🐶 por 🐼, os nomes das classes `.cat`/`.dog` ainda fariam sentido?**

**Resposta do desenvolvedor:**
> Erro não daria pois são só nomes, mas o ideal seria trocar em próximas refatorações ou melhor, tornar um nome genérico.

**Análise do revisor:** ✅ Correta. As classes `.cat`/`.dog` são apenas identificadores — o navegador não valida semântica. No entanto, a sugestão de **nomes genéricos** (como `.player1`/`.player2` ou `.symbol-a`/`.symbol-b`) é uma melhoria válida para desacoplar completamente o nome da classe do emoji exibido.

---

## 📊 Veredito Final

| Critério | Status |
|----------|--------|
| Compreensão do problema | ✅ **Domina** |
| Estratégia de separação (lógica vs UI) | ✅ **Domina** |
| Boas práticas de código limpo | ✅ **Domina** |
| Impacto das alterações nos testes | ✅ **Domina** |
| Consciência sobre limitações futuras | ✅ **Domina** |

**Conclusão:** O desenvolvedor demonstrou domínio completo sobre as alterações realizadas, compreendendo não apenas o *que* foi feito, mas também o *porquê* das decisões de design e suas implicações futuras. A refatoração com constantes no topo do arquivo mostra preocupação com manutenibilidade.

**Veredito: ✅ APROVADO — Pode prosseguir para a Tarefa 2.**

---

*Artefato gerado pelo agente revisor (GitHub Copilot) ao final da dinâmica socrática.*