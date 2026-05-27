# SPEC.md — Especificação Técnica: Gerador de Posts Instagram com IA

Este documento descreve a especificação técnica para a criação de um MVP (Minimum Viable Product) usando Next.js para gerar posts de carrossel do Instagram. O sistema utilizará chaves de API do sistema configuradas no servidor, referências de estilo/design, conteúdo do post, gerará os slides em HTML + CSS (embutido no mesmo arquivo) via LLM e renderizará em imagens PNG usando Playwright no backend.

---

## Escopo e Arquitetura

### 1. Modelos de IA & Integração Agnóstica
* **Provedor Inicial:** Integração com **OpenRouter** utilizando chaves de API de sistema.
* **Service/Adapter Pattern:** A integração com a IA será encapsulada em uma abstração agnóstica (`AIService`). Isso permitirá trocar ou adicionar novos provedores (como OpenAI nativo, Anthropic nativo ou Google Gemini) alterando apenas o adaptador específico, sem impactar as rotas de API ou a UI.
* **Segurança:** As chaves de API residirão exclusivamente no servidor em variáveis de ambiente (`.env.local`). O frontend não expõe nem coleta chaves do usuário final.

### 2. Formato e Design Visual
* **Formatos de Imagem:** 
  * Feed do Instagram (proporção 4:5, resolução **1080x1350**)
  * Stories/Reels (proporção 9:16, resolução **1080x1920**)
* **Geração Visual (HTML/CSS):** A IA gerará um arquivo HTML único com estilo inline ou incorporado em um bloco `<style>` na `<head>`. Cada slide será representado por uma `div` com a classe `.slide` (por exemplo, `<div class="slide" id="slide-01">...</div>`), o que permite visualização responsiva e renderização precisa das fontes (Google Fonts).

### 3. Fluxo de Trabalho (Renderização de Criativos)
1. **Input:** O usuário fornece um tema/conteúdo do post e arquivos de referência (markdown contendo manual de estilo ou imagens de referência).
2. **Geração:** O backend envia os inputs estruturados à IA com um prompt especializado (injetando as melhores práticas e regras inspiradas no MazyOS).
3. **Retorno da IA:** O sistema recebe um objeto JSON contendo:
   - O código HTML/CSS do carrossel.
   - A legenda otimizada para o post.
4. **Preview:** O HTML gerado é exibido instantaneamente em um `<iframe>` no frontend.
5. **Renderização (Exportação):** Ao solicitar a exportação, o backend inicia uma instância headless do Playwright, carrega o HTML, aguarda o carregamento das fontes, tira capturas de tela das `div`s `.slide` correspondentes ao formato selecionado, empacota-as com um arquivo `legenda.md` em um arquivo `.zip` e envia para download do usuário.

---

## Estrutura do Projeto (Proposed Files)

### Componente: Next.js Boilerplate
* `package.json` / `next.config.js` / `tsconfig.json` — Scaffolding inicial do Next.js com App Router.

### Componente: Abstração de IA (Services)
* `src/app/services/ai.ts` — Interface `AIService` e a classe de implementação concreta `OpenRouterAIService` (fábrica configurável via `.env.local`).

### Componente: Backend API Routes (App Router)
* `src/app/api/generate/route.ts` — Recebe o conteúdo e as referências, processa com o serviço de IA e retorna o JSON com o HTML e legenda.
* `src/app/api/render/route.ts` — Recebe o HTML gerado, inicializa o Playwright, captura os slides em PNG, monta o ZIP usando a biblioteca `jszip` e envia o buffer para download.

### Componente: Frontend UI
* `src/app/layout.tsx` e `src/app/page.tsx` — Painel principal responsivo com tema escuro (MazyOS Dark Mode).
* `src/app/globals.css` — Estilos globais e tokens de design do painel (Inter/Outfit, sombras suaves, gradientes).

---

## Plano de Verificação

### Verificação Manual
1. **Configuração local:** Criar `.env.local` contendo a chave `OPENROUTER_API_KEY`.
2. **Executar em desenvolvimento:** `npm run dev` e acessar `http://localhost:3000`.
3. **Geração de post:** Enviar um tema simples e validar se o preview no `<iframe>` renderiza corretamente.
4. **Download e Imagens:** Exportar o carrossel e verificar se o arquivo ZIP contém as imagens PNG nas dimensões exatas configuradas (1080x1350 ou 1080x1920) e a legenda formatada em markdown.
