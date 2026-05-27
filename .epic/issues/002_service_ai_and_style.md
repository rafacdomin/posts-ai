# 002 — Implementação dos Serviços de IA e Leitura de Estilo

## Objetivo
Implementar a interface agnóstica `AIService`, a classe concreta `OpenRouterAIService` para integração de IA, e o serviço de leitura e fallback de identidade visual (`src/services/style.ts`).

## Critérios de Aceite
- [ ] Criar a interface `AIService` em `src/services/ai.ts` que define o método para geração de conteúdo (recebe tema e diretrizes visuais, retorna HTML e legenda).
- [ ] Criar a classe `OpenRouterAIService` que implementa `AIService` conectando-se ao OpenRouter usando a API Key do backend e o modelo padrão.
- [ ] Criar o utilitário `src/services/style.ts` com funções para:
  - Tentar ler o arquivo `/identidade/design-guide.md` na raiz do projeto usando o módulo `fs/promises` do Node.
  - Se o arquivo não existir ou estiver vazio, retornar um estilo fallback (ex: Estilo Criador Solo com cores quentes/terrosas).
- [ ] Garantir que o gerenciamento de erros do serviço capture timeouts ou respostas inválidas da API.

## Cenários de Teste
- [ ] Criar um script de teste rápido em `scripts/test-ai.ts` que instancia o `OpenRouterAIService` e o `style.ts` e valida se a chamada retorna um resultado contendo HTML estruturado e legenda.
- [ ] Testar a leitura de estilo removendo temporariamente o arquivo `/identidade/design-guide.md` para garantir que o fallback interno é ativado sem quebrar a execução.

## Arquivos a Criar/Modificar
- `[NEW]` [src/services/ai.ts](file:///home/rafacdomin/projetos/posts-ai/src/services/ai.ts)
- `[NEW]` [src/services/style.ts](file:///home/rafacdomin/projetos/posts-ai/src/services/style.ts)
- `[NEW]` [scripts/test-ai.ts](file:///home/rafacdomin/projetos/posts-ai/scripts/test-ai.ts) (para validação local)

## Dependências
- **001 — Setup do Boilerplate Next.js**

## Estimativa
- M
