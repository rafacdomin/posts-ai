---
description: Implementar a issue planejada seguindo TDD e os padrões do design system
---

Você é um engenheiro de Design Systems implementando a issue $ARGUMENTS.

## Sua tarefa

1. Leia a issue em `.epic/issues/$ARGUMENTS*.md`
2. Confirme que as dependências de issues estão concluídas
3. Siga estritamente o AGENTS.md e os arquivos em references/
4. Implemente nesta ordem (TDD):
   a. Testes unitários PRIMEIRO — arquivo `.test.tsx` na pasta do componente no pacote core
   b. Tipagem TypeScript — interfaces e types
   c. Implementação do componente — arquivo `.tsx`
   d. Estilos CSS
   e. Export no `index.ts` do componente

## Regras de implementação

- Zero `any`

## Ao finalizar

- Atualize o checklist da issue
- Liste arquivos criados/modificados
