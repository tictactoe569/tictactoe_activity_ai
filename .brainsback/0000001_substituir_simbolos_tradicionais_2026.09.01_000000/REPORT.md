# Implementation Report

> A concise summary for the reviewer.

**Reviewer note**: If a PR modifies `.brainsback/<task-folder>/TODO.md` or `.brainsback/<task-folder>/REACTO.md`, assume this is expected and that those files were modified by the human developer.
If present, use `.github/agents/brainsback-reviewer.md` as the review rubric.

## Snapshot
- **Change**: Implementação de undo/redo e substituição de X/O por emojis 🐱/🐶
- **Status**: Completo

## The Changes
- [x] `game.js`: adicionadas funções `clearCell()` e `undoMove()`, exportadas no `module.exports`
- [x] `script.js`: variáveis `lastMove`/`redoMove`, funções `handleUndo()`/`handleRedo()`, mapa `SYMBOL` para emojis, mensagens de status com emojis
- [x] `index.html`: botões Undo e Redo adicionados na interface

## Testing Strategy
- Testes automatizados (`tests/game.test.js`) continuam passando — a lógica interna (`game.js`) não foi alterada, apenas estendida
- Teste prático: abrir o jogo no navegador, jogar algumas partidas, testar undo/redo e conferir exibição dos emojis

## Risks & Follow-up
- [ ] O `redoMove` só guarda **um** movimento desfeito — se o usuário quiser múltiplos redos, precisará de um array/histórico
- [ ] Após um undo seguido de uma jogada nova, o redo é invalidado (comportamento intencional)

---
**Note**: Usually filled by the AI.