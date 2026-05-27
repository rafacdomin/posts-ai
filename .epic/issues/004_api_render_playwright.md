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

## Pesquisa & Referências
- **Navegadores no Playwright:** O pacote `playwright` expõe o módulo `chromium` que permite instanciar e gerenciar navegadores sem interface gráfica (headless) de forma muito rápida via `chromium.launch({ headless: true })`.
- **Download em Lote com JSZip:** A biblioteca `jszip` permite empacotar arquivos binários e de texto de forma síncrona/assíncrona na memória do servidor e exportar o buffer compactado em formato Node.js Buffer com `generateAsync({ type: "nodebuffer" })`.
- **Carregamento de Fontes em Iframe/Browser:** O comando `document.fonts.ready` retorna uma Promise que é resolvida apenas após todas as fontes de estilo declaradas (inclusive Google Fonts importadas) serem totalmente carregadas na página.

## Decisões Técnicas
- **Garantia de Fechamento de Processos (Garbage Collector de Browsers):** O ciclo de vida do browser Playwright será protegido por uma cláusula `try/finally` para evitar processos fantasmas na memória RAM do servidor se ocorrerem erros inesperados no HTML ou no parse.
- **Tratamento Seguro de Erros (TypeScript Estrito):** Evitaremos o tipo `any` definindo uma interface `RenderRequest` para tipar o payload de entrada da requisição. Qualquer erro desconhecido capturado no bloco `catch` será devidamente tipado como `unknown`.
- **Screenshot de Elementos Específicos:** Em vez de capturar a tela inteira do navegador (`page.screenshot()`), usaremos seletores de elementos (`page.$$('.slide')`) para tirar screenshots apenas das divs dos slides, garantindo que qualquer excesso de margem seja recortado.

## Implementação Planejada

### Assinatura e Estrutura de `/api/render/route.ts`
```typescript
import { NextResponse } from "next/server";
import { chromium } from "playwright";
import JSZip from "jszip";

interface RenderRequest {
  html?: string;
  caption?: string;
  format?: "feed" | "stories";
}

export async function POST(request: Request): Promise<Response> {
  let browser: any = null; // Tipado localmente ou inferido para controle de fechamento
  try {
    // 1. Validar e tipar o request JSON
    // 2. Extrair e validar format, html e caption
    // 3. Inicializar chromium headless
    // 4. Configurar viewport baseado no formato (1080x1350 ou 1080x1920)
    // 5. page.setContent(html) e aguardar document.fonts.ready
    // 6. page.$$('.slide') e iterar executando slide.screenshot()
    // 7. Agrupar em JSZip os buffers de PNG e a legenda.md
    // 8. Retornar Response com header Content-Type application/zip
  } catch (error: unknown) {
    // Retornar NextResponse.json com status 500
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
```

## Checklist de Implementação
- [x] 1. Criar o diretório `src/app/api/render/` se ele não existir.
- [x] 2. Criar o arquivo `src/app/api/render/route.ts`.
- [x] 3. Importar os módulos `NextResponse` de `"next/server"`, `chromium` de `"playwright"` e `JSZip` de `"jszip"`.
- [x] 4. Declarar a interface `RenderRequest` contendo os campos opcionais `html`, `caption` e `format` (como união de `"feed" | "stories"`).
- [x] 5. Implementar a rota `POST` principal com bloco `try/catch/finally` contendo a variável `browser` inicializada como `null` fora do escopo do try.
- [x] 6. Adicionar validação do payload do JSON de entrada (garantir que `html` e `caption` são strings válidas, e `format` é `"feed"` ou `"stories"`). Responder com status `400` se houver falha de validação.
- [x] 7. Configurar as dimensões da viewport baseando-se no `format` recebido (Feed: 1080x1350 | Stories: 1080x1920).
- [x] 8. Inicializar o Playwright Chromium headless e criar uma nova página configurando o tamanho da janela de visualização (`setViewportSize`).
- [x] 9. Definir o conteúdo da página com `page.setContent(html, { waitUntil: 'networkidle' })`.
- [x] 10. Aguardar o carregamento assíncrono das fontes declaradas usando `page.evaluate(() => document.fonts.ready)`.
- [x] 11. Obter todos os elementos que possuem a classe `.slide` usando `page.$$('.slide')`.
- [x] 12. Se nenhum slide for encontrado, lançar um erro explícito para evitar gerar um ZIP vazio.
- [x] 13. Iterar sobre a lista de slides obtendo a captura de tela individual de cada um (`slide.screenshot({ type: 'png' })`) e salvando em um array de buffers na memória.
- [x] 14. Instanciar a classe `JSZip`, adicionar as imagens numeradas sequencialmente (`slide-1.png`, `slide-2.png`, etc.) e o arquivo `legenda.md`.
- [x] 15. Gerar o buffer compactado em formato NodeBuffer com `generateAsync({ type: 'nodebuffer' })`.
- [x] 16. Garantir que no bloco `finally`, se a variável `browser` estiver preenchida, o comando `await browser.close()` seja executado.
- [x] 17. Retornar um objeto de `Response` contendo o buffer do ZIP com status `200` e os cabeçalhos apropriados de download de ZIP (`application/zip`).
- [x] 18. Criar um script de teste local `scripts/test-render.ts` que envia um HTML estático mockado para `/api/render` localmente no servidor de desenvolvimento, grava o arquivo `carrossel.zip` resultante no disco e valida que o arquivo ZIP é descompactado sem corrupção e contém as proporções corretas.

