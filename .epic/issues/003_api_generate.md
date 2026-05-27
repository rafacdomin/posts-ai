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
