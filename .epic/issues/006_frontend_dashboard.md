# 006 — Implementação do Painel Principal (Dashboard UI) e Estilização

## Objetivo
Implementar o painel principal (`src/app/page.tsx`) e a folha de estilos globais (`src/app/globals.css`), unindo os campos de entrada, controle de estados de geração, exibição do preview e o acionamento de exportação de arquivos em uma interface escura premium moderna.

## Critérios de Aceite
- [ ] Implementar a página principal `src/app/page.tsx` como um Client Component (`"use client"`).
- [ ] Criar a barra lateral (Sidebar) com:
  - Campo de texto (textarea) para inserir o tema/roteiro do post.
  - Campo de texto (textarea) expansível para diretrizes de estilo, pré-preenchido com a identidade padrão carregada na inicialização do app.
  - Seletor de Formato (Instagram Feed vs. Stories).
  - Botão de "Gerar Carrossel" com feedback de carregamento desabilitado quando a requisição está em andamento.
- [ ] Criar a área principal com abas (Tabs):
  - **Aba "Visualização":** Exibe o componente `IframePreview`, botões de navegação "Anterior" e "Próximo", e um contador de slides (ex: `Slide 2 / 5`).
  - **Aba "Legenda":** Exibe a legenda em formato markdown com um botão rápido de "Copiar Legenda".
  - **Aba "Código HTML":** Exibe o código-fonte gerado em um bloco formatado com rolagem horizontal e botão de "Copiar Código".
- [ ] Implementar o overlay ou barra de status indicando o progresso detalhado das etapas assíncronas (ex: "Chamando OpenRouter...", "Renderizando imagens...", "Baixando ZIP...").
- [ ] Integrar o botão "Exportar Carrossel (ZIP)" que consome `/api/render` enviando o HTML, legenda e formato, realizando o download automático do ZIP gerado.
- [ ] Estilizar o dashboard no arquivo `src/app/globals.css` utilizando CSS puro (sem TailwindCSS):
  - Fundo escuro premium (`#0B0B0C` ou `#0F0F11`).
  - Cards e painéis com fundo cinza escuro translúcido (`#16161A` ou `#1E1E22`) e bordas finas sutis (`1px solid #2A2A30`).
  - Botão principal com gradiente ativo em tom moderno (indigo/violeta `#6366F1`).
  - Fontes Inter ou Outfit carregadas via Google Fonts ou nativas da plataforma.
  - Hover effects e micro-animações de carregamento (spinners ou barras pulsantes).

## Cenários de Teste
- [ ] Acessar o dashboard e testar o fluxo de ponta a ponta: digitar um tema, gerar o carrossel, navegar pelos slides no preview, copiar a legenda e exportar o ZIP completo.
- [ ] Validar a responsividade da tela em resoluções de desktop comuns (Full HD) e telas menores de notebooks (1366x768).
- [ ] Garantir que o estado de "loading" bloqueie novas submissões de formulário durante a geração para evitar concorrência.

## Arquivos a Criar/Modificar
- `[MODIFY]` [src/app/page.tsx](file:///home/rafacdomin/projetos/posts-ai/src/app/page.tsx)
- `[MODIFY]` [src/app/globals.css](file:///home/rafacdomin/projetos/posts-ai/src/app/globals.css)
- `[MODIFY]` [src/app/layout.tsx](file:///home/rafacdomin/projetos/posts-ai/src/app/layout.tsx)

## Dependências
- **003 — Implementação da Rota de Geração (/api/generate)**
- **004 — Implementação da Rota de Renderização (/api/render)**
- **005 — Componente React de Preview (IframePreview)**

## Estimativa
- G
