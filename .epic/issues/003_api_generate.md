# 003 — Implementação da Rota de Geração (/api/generate)

## Objetivo
Criar a rota de API backend `/api/generate` (App Router POST) que recebe as instruções do usuário, aciona os serviços de IA e retorna o HTML do carrossel e a legenda formatada.

## Critérios de Aceite
- [ ] Criar a rota `src/app/api/generate/route.ts` aceitando requisições `POST`.
- [ ] Ler o body da requisição contendo os parâmetros `theme` e opcionalmente `styleGuide` (caso não seja enviado, ler via `src/services/style.ts`).
- [ ] Construir um prompt do sistema (System Prompt) robusto instruindo a IA a:
  - Responder estritamente em formato JSON com chaves `"html"` e `"caption"`.
  - Gerar HTML válido contendo apenas elementos estruturais dos slides (ex: divs com a classe `.slide`) e estilos embutidos em tag `<style>` ou inline.
  - Não envelopar o JSON retornado em blocos de código markdown (como ```json...```).
  - Incluir importação de Google Fonts e design premium (gradientes, margens de segurança, contraste).
- [ ] Chamar o `AIService` com o prompt estruturado e fazer o parse da resposta com segurança.
- [ ] Retornar o JSON resultante com status `200` em caso de sucesso ou JSON de erro apropriado (`400`/`500`) em caso de falha de validação ou de rede.

## Cenários de Teste
- [ ] Fazer uma requisição `POST` para `/api/generate` usando um cliente HTTP (Curl/Postman) com um payload válido e validar se a resposta tem a estrutura `{ success: true, data: { html: "...", caption: "..." } }`.
- [ ] Fazer uma requisição `POST` com body vazio ou inválido e garantir que a API responde com status `400` e mensagem de erro em formato JSON.

## Arquivos a Criar/Modificar
- `[NEW]` [src/app/api/generate/route.ts](file:///home/rafacdomin/projetos/posts-ai/src/app/api/generate/route.ts)

## Dependências
- **002 — Implementação dos Serviços de IA e Leitura de Estilo**

## Estimativa
- P

## Pesquisa & Referências
- **Handlers de Rota no Next.js (App Router):** Rotas de API são definidas usando arquivos `route.ts`. Métodos HTTP correspondentes (como `POST`) são exportados como funções assíncronas. Recebem um objeto `Request` e retornam uma `Response` ou `NextResponse`.
- **Validação de Payload:** Para evitar erros em tempo de execução no LLM, é necessário validar que o corpo da requisição POST é do tipo JSON e que a propriedade obrigatória `theme` existe e não é uma string vazia.
- **Tratamento de Erros em APIs HTTP:** Respostas de erro devem retornar o cabeçalho de status correto (`400` para erros de validação do cliente, `500` para falhas internas de integração ou servidor) e um objeto JSON explicativo.

## Decisões Técnicas
- **Uso do NextRequest vs Request:** Utilizaremos `Request` nativo para ler o corpo da requisição, mantendo as dependências limpas.
- **Resiliência do Body Parser:** A leitura de `request.json()` será encapsulada em um bloco `try/catch` específico. Caso o cliente envie um JSON quebrado ou payload não-JSON, a API responderá com status `400` imediatamente em vez de falhar com erro 500.
- **Resolução de Estilo no Servidor:** A API resolverá a identidade visual importando o utilitário `readStyleGuide` local. Se o cliente enviar um `styleGuide` customizado, ele terá precedência sobre o arquivo local `/identidade/design-guide.md`, tornando a API flexível para chamadas externas.

## Implementação Planejada

### Assinatura e Estrutura de `/api/generate/route.ts`
```typescript
import { NextResponse } from "next/server";
import { OpenRouterAIService } from "@/services/ai";
import { readStyleGuide } from "@/services/style";

export async function POST(request: Request): Promise<Response> {
  try {
    // 1. Parse e validação do JSON do request
    // 2. Leitura do theme e styleGuide
    // 3. Fallback do styleGuide via readStyleGuide() caso vazio
    // 4. Chamada para OpenRouterAIService
    // 5. Retorno de sucesso (JSON)
  } catch (error: unknown) {
    // 6. Tratamento de erro detalhado e retorno com status 400 ou 500
  }
}
```

## Checklist de Implementação
- [x] 1. Criar o diretório `src/app/api/generate/` se ele não existir.
- [x] 2. Criar o arquivo `src/app/api/generate/route.ts`.
- [x] 3. Importar `NextResponse` de `"next/server"` e as classes/funções necessárias de `ai.ts` e `style.ts`.
- [x] 4. Implementar a função `POST` principal.
- [x] 5. Adicionar bloco `try/catch` para capturar falha de parse no `request.json()`, retornando status `400` com mensagem formatada em JSON.
- [x] 6. Adicionar validação para o campo `theme` (verificar se existe e se é uma string válida com comprimento maior que 0). Retornar status `400` em caso de erro.
- [x] 7. Ler a variável `styleGuide`. Se ela não estiver presente ou for vazia, chamar `readStyleGuide()` de forma assíncrona.
- [x] 8. Instanciar a classe `OpenRouterAIService`.
- [x] 9. Executar a chamada `generateCarousel(theme, styleGuideResolved)` de forma assíncrona.
- [x] 10. Retornar a resposta encapsulada em um `NextResponse.json` com status `200` e a propriedade `success: true`.
- [x] 11. Implementar o bloco `catch` principal capturando erros do tipo `unknown`, extraindo a mensagem segura e retornando `NextResponse.json` com status `500` e a propriedade `success: false`.
- [x] 12. Iniciar o servidor local `npm run dev` e testar a chamada via curl enviando um payload válido.
- [x] 13. Validar se a rota responde com status `400` ao enviar um JSON vazio ou malformado.

