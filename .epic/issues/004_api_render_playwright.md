# 004 — Implementação da Rota de Renderização (/api/render)

## Objetivo
Criar a rota de API backend `/api/render` (App Router POST) que recebe o HTML dos slides, a legenda e o formato desejado, utiliza o Playwright para renderizar e capturar os slides em PNG de alta resolução, agrupa-os em um ZIP (usando `jszip`) e retorna o arquivo para download.

## Critérios de Aceite
- [ ] Criar a rota `src/app/api/render/route.ts` que aceita requisições `POST`.
- [ ] Validar o body contendo `html` (string), `caption` (string) e `format` (valores: `"feed"` ou `"stories"`).
- [ ] Configurar dinamicamente a viewport do Playwright:
  - Feed: `1080` de largura por `1350` de altura.
  - Stories: `1080` de largura por `1920` de altura.
- [ ] Inicializar uma instância headless do Chromium usando Playwright.
- [ ] Carregar o HTML recebido no navegador:
  - Definir o conteúdo com `page.setContent(html, { waitUntil: 'networkidle' })`.
  - Aguardar explicitamente o carregamento completo das fontes da web via `page.evaluate(() => document.fonts.ready)`.
- [ ] Localizar todas as divs com a classe `.slide` na página.
- [ ] Iterar sobre as divs capturando um screenshot de cada elemento de forma isolada (`slide.screenshot({ type: 'png' })`).
- [ ] Compactar os screenshots em formato PNG denominados `slide-1.png`, `slide-2.png`, etc.
- [ ] Adicionar o arquivo `legenda.md` com o texto da legenda fornecida no mesmo diretório ZIP.
- [ ] Gerar o buffer ZIP usando a biblioteca `jszip`.
- [ ] Retornar o buffer binário com o cabeçalho `Content-Type: application/zip` e `Content-Disposition` para download imediato.
- [ ] Garantir o encerramento correto do navegador Playwright ao final da execução, mesmo em caso de erro (bloco `finally`).

## Cenários de Teste
- [ ] Enviar uma requisição `POST` com um HTML simples contendo três divs `.slide` e verificar se a API retorna um buffer ZIP contendo exatamente 3 imagens PNG e 1 arquivo `legenda.md`.
- [ ] Testar a exportação alterando o formato de "feed" para "stories" e certificar-se de que a resolução das imagens extraídas do ZIP corresponde às dimensões especificadas (1080x1350 vs 1080x1920).
- [ ] Simular um HTML inválido para garantir que o erro de renderização é tratado e o browser do Playwright é fechado de forma limpa.

## Arquivos a Criar/Modificar
- `[NEW]` [src/app/api/render/route.ts](file:///home/rafacdomin/projetos/posts-ai/src/app/api/render/route.ts)

## Dependências
- **001 — Setup do Boilerplate Next.js**

## Estimativa
- G
