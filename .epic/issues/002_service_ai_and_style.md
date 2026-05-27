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

## Pesquisa & Referências
- **API do OpenRouter:** O endpoint para completions é `https://openrouter.ai/api/v1/chat/completions`. Requer o header `Authorization: Bearer <KEY>` e `Content-Type: application/json`.
- **JSON Mode:** Alguns LLMs no OpenRouter suportam a propriedade `response_format: { type: "json_object" }` para forçar respostas em JSON puro. O prompt do sistema deve ser explícito para complementar e garantir o formato.
- **Node.js File Reading:** Usaremos `fs/promises` para carregar o arquivo markdown de forma assíncrona com `readFile(path, 'utf-8')` e trataremos erros de arquivo inexistente (`ENOENT`) para retornar o fallback de forma graciosa.

## Decisões Técnicas
- **Abstração AIService:** A criação de uma interface `AIService` permite desacoplar a chamada do OpenRouter do restante da aplicação. Se no futuro for necessário trocar para OpenAI nativo, Anthropic nativo ou local, basta criar outra classe e mudar a fábrica/inicialização.
- **Integração sem SDK (Native Fetch):** Fazer requisições POST diretas usando a API nativa de `fetch` do Node.js/Next.js evita dependências desnecessárias (como o pacote `openai`) e mantém a aplicação leve e fácil de debugar.
- **Fallback Hardcoded:** Em `src/services/style.ts`, salvaremos uma constante com o estilo "Criador Solo" terroso. Desta forma, mesmo se o arquivo `design-guide.md` for apagado acidentalmente, a geração de carrosséis continuará funcionando com um visual bonito.

## Implementação Planejada

### Interface e Adaptador em `src/services/ai.ts`
```typescript
export interface AIServiceResponse {
  html: string;
  caption: string;
}

export interface AIService {
  generateCarousel(theme: string, styleGuide: string): Promise<AIServiceResponse>;
}

export class OpenRouterAIService implements AIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || "";
    this.model = process.env.DEFAULT_AI_MODEL || "anthropic/claude-3.5-sonnet";
  }

  async generateCarousel(theme: string, styleGuide: string): Promise<AIServiceResponse> {
    if (!this.apiKey) {
      throw new Error("OPENROUTER_API_KEY não configurada no servidor.");
    }
    // Requisição HTTP fetch para OpenRouter
    // Tratar parsing de JSON e retornar AIServiceResponse
  }
}
```

### Leitor de Estilo em `src/services/style.ts`
```typescript
import fs from "fs/promises";
import path from "path";

export const DEFAULT_STYLE_FALLBACK = `# Identidade — Criador Solo (Estilo Quente & Editorial)
...`; // Estilo completo terroso

export async function readStyleGuide(): Promise<string> {
  const filePath = path.join(process.cwd(), "identidade", "design-guide.md");
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data.trim() || DEFAULT_STYLE_FALLBACK;
  } catch (error) {
    // Se o arquivo não existir (ENOENT) ou houver outro erro, retornar o padrão
    return DEFAULT_STYLE_FALLBACK;
  }
}
```

## Checklist de Implementação
- [x] 1. Criar o diretório `src/services/` se ele não existir.
- [x] 2. Criar o arquivo `src/services/ai.ts` contendo as interfaces `AIServiceResponse`, `AIService` e a classe `OpenRouterAIService`.
- [x] 3. Implementar o construtor da classe `OpenRouterAIService` lendo as variáveis de ambiente com fallback seguro.
- [x] 4. Implementar o método `generateCarousel` em `OpenRouterAIService` fazendo uma chamada `fetch` para `https://openrouter.ai/api/v1/chat/completions`.
- [x] 5. Adicionar lógica de validação na chamada do OpenRouter (lançar erro se a requisição falhar ou se o JSON retornado não contiver a estrutura correta).
- [x] 6. Criar o arquivo `src/services/style.ts` contendo a constante `DEFAULT_STYLE_FALLBACK` (contendo o markdown do manual de identidade do Criador Solo) e a função assíncrona `readStyleGuide`.
- [x] 7. Implementar o tratamento de erro em `readStyleGuide` para garantir retorno do fallback em caso de arquivo inexistente.
- [x] 8. Adicionar a dependência `"tsx": "^4"` nas `devDependencies` do `/package.json` para rodar scripts TypeScript locais.
- [x] 9. Executar `npm install` para instalar a dependência `tsx`.
- [x] 10. Criar o script de teste `scripts/test-ai.ts` que lê a chave do `.env.local`, carrega as diretrizes de estilo, gera um carrossel de teste e imprime os campos `html` e `caption` no console.
- [x] 11. Rodar `npx tsx scripts/test-ai.ts` e validar se a integração com a IA gerou os dados corretamente de acordo com o contrato.

