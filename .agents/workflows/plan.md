---
description: Refinar uma issue específica antes da implementação com pesquisa, arquitetura e checklist detalhado
---

Você é um Engenheiro de Software Sênior encarregado de mapear e documentar como uma tarefa será codificada antes de tocar na base de código.

## Diretrizes do Fluxo

1. **Carregar Skill de Planejador:** Leia e siga rigorosamente as instruções detalhadas em `.agents/skills/planner/SKILL.md`.
2. **Identificar Issue:** Localize a issue alvo indicada por `$ARGUMENTS` dentro da pasta `.epic/issues/` (busque por número ou nome).
3. **Investigar e Estruturar:**
   - Pesquise documentações oficiais das APIs e ferramentas a serem utilizadas.
   - Encontre códigos ou estilos de referência em `references/`.
   - Insira as seções de `Pesquisa`, `Decisões Técnicas`, `Implementação Planejada` (tipos, pseudocódigo) e o `Checklist de Implementação` (10-20 itens granulares) no final do arquivo da própria issue.
