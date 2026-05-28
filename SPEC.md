# SPEC.md — Especificação Técnica: Gerador de Posts Instagram com IA

Este documento descreve a especificação técnica para a criação de um MVP (Minimum Viable Product) usando Next.js para gerar posts de carrossel do Instagram. O sistema utiliza chaves de API configuradas no servidor, referências de estilo/design e conteúdo do post para gerar slides em HTML + CSS (embutido no mesmo arquivo) via LLM e renderizá-los em imagens PNG usando Playwright no backend.

---

## 1. Visão Geral

O objetivo deste projeto é construir uma aplicação totalmente autônoma e independente para automatizar a criação de carrosséis visuais e legendas para redes sociais (focado em Instagram Feed e Stories/Reels). 

> [!NOTE]
> O diretório de referências (`references/MazyOS`) serve apenas como fonte de consulta durante o desenvolvimento (arquitetura e exemplos de identidade) e deve ser omitido/ignorado no repositório final da aplicação. A aplicação final deve ser autossuficiente.

A aplicação permite que o usuário insira um tema ou roteiro, selecione diretrizes visuais (carregadas automaticamente de arquivos locais de identidade ou coladas na interface) e receba:
1. Um preview interativo em tempo real do carrossel (em um `<iframe>`).
2. Um pacote ZIP contendo as imagens dos slides em alta definição (PNG) e um arquivo `legenda.md` pronto para publicação.

---

## 2. Stack Técnica & Dependências

* **Framework:** Next.js 14+ (App Router) com TypeScript.
* **Estilização do Painel (Dashboard):** CSS Modules ou Vanilla CSS. Layout responsivo com tema escuro premium (`#0B0B0C`, `#16161A`, bordas translúcidas, fontes interativas).
* **Integração de IA:** OpenRouter API utilizando a biblioteca/SDK oficial ou requisições HTTP diretas, encapsulado no padrão Adapter (`AIService`).
  * **Modelo Padrão (Fixo no Backend):** `anthropic/claude-3.5-sonnet` (ou modelo configurável via variável de ambiente `.env.local` como fallback).
* **Renderizador de Imagem:** Playwright (Headless Browser) executado no backend (`/api/render`).
* **Manipulação de ZIP:** `jszip` para empacotar os assets gerados.
* **Variáveis de Ambiente Necessárias (`.env.local`):**
  * `OPENROUTER_API_KEY` — Chave de API do OpenRouter.
  * `DEFAULT_AI_MODEL` — Modelo a ser consumido.

---

## 3. Casos de Uso e Fluxos de Usuário

### Fluxo Principal
1. **Configuração de Estilo:** O sistema tenta ler o arquivo `identidade/design-guide.md` local se existir. Caso contrário, carrega uma identidade visual padrão de marca (estilo "Agência de Performance" ou "Criador Solo").
2. **Entrada de Conteúdo:** O usuário acessa o dashboard e insere o tema/roteiro do post no campo de texto.
3. **Geração:** O usuário clica em "Gerar Posts".
   * A rota `/api/generate` é chamada.
   * O backend lê a identidade visual e o tema, constrói o prompt estruturado e faz a chamada ao OpenRouter.
   * O OpenRouter retorna um JSON com o HTML/CSS dos slides e a legenda.
4. **Visualização:** O HTML recebido é renderizado em um `<iframe>` interativo no painel. O usuário pode navegar entre os slides utilizando botões de anterior/próximo e alternar a visualização entre Feed (1080x1350) e Stories (1080x1920).
5. **Exportação:** O usuário clica em "Exportar Imagens".
   * A rota `/api/render` recebe o HTML, o formato de imagem selecionado e a legenda.
   * O Playwright inicializa no backend, carrega o HTML, aguarda o carregamento das fontes (ex: Google Fonts), tira prints de cada div `.slide` com as dimensões corretas (1080x1350 ou 1080x1920) e gera os arquivos PNG.
   * O backend cria um ZIP com os arquivos `slide-1.png`, `slide-2.png`, etc., e o arquivo `legenda.md`.
   * O download do ZIP inicia automaticamente no navegador do usuário.

---

## 4. Contratos de API (JSON)

### 4.1 Rota `/api/generate` (POST)

**Request Body:**
```json
{
  "theme": "5 dicas de produtividade usando IA no dia-a-dia",
  "styleGuide": "# Identidade — Criador Solo\n\n- **Fundo principal:** #FAF7F2\n..."
}
```

*Nota: Se `styleGuide` não for enviado, o servidor buscará o arquivo local `identidade/design-guide.md` ou usará um fallback de estilo interno.*

**Response Body (Success 200):**
```json
{
  "success": true,
  "data": {
    "html": "<!DOCTYPE html><html><head><style>...</style></head><body><div class=\"slide\">...</div></body></html>",
    "caption": "# 5 Dicas de Produtividade...\n\nConteúdo da legenda com hashtags..."
  }
}
```

---

### 4.2 Rota `/api/render` (POST)

**Request Body:**
```json
{
  "html": "<!DOCTYPE html><html>...",
  "caption": "# Legenda do post...",
  "format": "feed" // "feed" (1080x1350) ou "stories" (1080x1920)
}
```

**Response:**
* Retorna um arquivo binário contendo o ZIP (`application/zip`).

---

## 5. Estrutura do Projeto & Arquitetura de Código

O repositório seguirá a estrutura clássica do Next.js App Router:

```
/
├── public/                 # Assets estáticos
├── identidade/             # Identidade visual padrão local
│   └── design-guide.md     # Regras de cores, fontes e estilo
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/
│   │   │   │   └── route.ts  # Endpoint de geração via LLM
│   │   │   └── render/
│   │   │       └── route.ts  # Endpoint de renderização via Playwright
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Dashboard principal (Single Page Application)
│   │   └── globals.css       # Estilização global do painel (Tema Escuro)
│   ├── services/
│   │   ├── ai.ts             # Interface AIService e Adaptador OpenRouter
│   │   └── style.ts          # Utilitário para leitura e fallback de identidade visual
│   └── components/
│       └── IframePreview.tsx # Componente de preview encapsulado
```

### 5.1 Regras de Design e Estruturação do HTML dos Slides
Para garantir que os slides fiquem visualmente idênticos tanto no iframe de preview quanto nos prints do Playwright, as seguintes diretrizes de CSS devem ser seguidas pela IA ao gerar o código HTML:

* **Tamanho Relativo:** O layout dos slides deve utilizar variáveis CSS na raiz (`:root`) para definir o tamanho do slide. O container de cada slide deve ler essas variáveis:
  ```css
  :root {
    --slide-width: 1080px;
    --slide-height: 1350px;
  }
  .slide {
    width: var(--slide-width);
    height: var(--slide-height);
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 80px 60px; /* Margens de segurança generosas */
  }
  ```
* **Fontes Web:** As fontes declaradas nas diretrizes de estilo devem ser importadas no início do bloco `<style>` (ex: `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');`).
* **Visual Premium:** O prompt da IA instruirá a criação de designs dinâmicos:
  - Slide 1: Título gigante, subtítulo forte, design focado em reter atenção (gancho).
  - Slides Intermediários: Conteúdo estruturado em listas limpas, blocos de destaque (cards) ou citações com alto contraste.
  - Slide Final (CTA): Direcionamento claro (ex: "Siga para mais", "Salve para consultar depois") com espaço demarcado para logotipo ou assinatura.
  - Uso de gradientes de fundo sutis, numeração de slides (`Slide 1/5`) e barras de progresso visuais.

---

## 6. Estratégia de Teste e Validação

### Testes Manuais
1. **Fluxo de Geração:** Enviar múltiplos temas com diferentes tamanhos de texto e validar se a IA retorna um JSON estruturado válido e se o dashboard lida corretamente com erros de geração (timeouts, tokens excedidos).
2. **Visualização no Iframe:** Validar se o HTML gerado é exibido corretamente no `<iframe>` e responde à mudança de dimensões (Feed vs. Stories) reajustando seu tamanho proporcionalmente (usando CSS `transform: scale()` ou redimensionamento direto do viewport do iframe).
3. **Download do ZIP:** Exportar nos dois formatos (Feed/Stories) e abrir o arquivo ZIP extraído para verificar:
   - Resolução das imagens (exatamente 1080x1350px para feed e 1080x1920px para stories).
   - Legibilidade do texto (fontes do Google carregadas corretamente, sem quebras indesejadas de layout).
   - Presença do arquivo `legenda.md` com o texto em markdown.

---

## 7. Definição de Pronto (Definition of Done)

Para considerar a implementação desta especificação como concluída:
1. [ ] A rota `/api/generate` lê a identidade visual local em `identidade/design-guide.md` (se existir) ou usa o padrão e faz a requisição de forma assíncrona e segura ao OpenRouter.
2. [ ] A IA gera HTML sem tags de markdown adicionais em volta do JSON (retorna JSON puro pronto para parse).
3. [ ] A rota `/api/render` utiliza Playwright headless para capturar imagens PNG perfeitas de todas as divs `.slide`, esperando que todas as Web Fonts carreguem completamente antes de fotografar.
4. [ ] O ZIP é gerado com sucesso contendo todas as imagens PNG correspondentes e a legenda do post.
5. [ ] O Painel do Usuário (Dashboard) é totalmente responsivo, possui interface com estética escura premium, sem placeholders, e fornece preview visual e feedback claro sobre o estado de carregamento/geração do post.

