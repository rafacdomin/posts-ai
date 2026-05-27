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
- `[NEW]` [src/components/Dashboard.tsx](file:///home/rafacdomin/projetos/posts-ai/src/components/Dashboard.tsx)

## Dependências
- **003 — Implementação da Rota de Geração (/api/generate)**
- **004 — Implementação da Rota de Renderização (/api/render)**
- **005 — Componente React de Preview (IframePreview)**

## Estimativa
- G

## Pesquisa & Referências
- **Hydration no Next.js:** Misturar lógica do servidor com interatividade do cliente no App Router requer a separação de responsabilidades. O arquivo `page.tsx` padrão (Server Component) pode ler dados sensíveis ou locais e injetá-los como propriedades (`props`) em um Client Component filho.
- **Manipulação de Blobs no Navegador:** Para fazer o download de arquivos binários recebidos via requisição assíncrona `fetch`, converte-se a resposta em um `Blob` e gera-se uma URL temporária com `window.URL.createObjectURL(blob)`, acionando um clique simulado em um link oculto `<a>`.
- **Copiar para a Área de Transferência:** A API moderna `navigator.clipboard.writeText(text)` fornece um método assíncrono seguro para cópia de texto, substituindo o antigo e obsoleto `document.execCommand`.

## Decisões Técnicas
- **Arquitetura de Componentes (Separar UI de Roteamento):**
  - `src/app/page.tsx` será mantido como um Server Component. Ele fará a leitura inicial do design guide do sistema usando `readStyleGuide` de forma assíncrona na inicialização, minimizando requisições redundantes no frontend.
  - `src/components/Dashboard.tsx` será o Client Component central. Ele conterá todos os estados de tela, formulários de entrada e a integração com as APIs do backend.
- **Tratamento de Estado de Progresso Detalhado:** Em vez de usar um loader booleano (`loading={true}`), criaremos um estado de texto para progresso (`statusMessage`) exibindo mensagens dinâmicas de cada estágio (ex: "Enviando dados para OpenRouter...", "Playwright tirando prints...", "Pronto para download!").

## Implementação Planejada

### Roteador de Entrada em `src/app/page.tsx` (Server Component)
```typescript
import { readStyleGuide } from "@/services/style";
import Dashboard from "@/components/Dashboard";

export default async function Page() {
  const initialStyleGuide = await readStyleGuide();
  return <Dashboard initialStyleGuide={initialStyleGuide} />;
}
```

### Componente Interativo em `src/components/Dashboard.tsx` (Client Component)
```typescript
"use client";

import React, { useState } from "react";
import IframePreview from "@/components/IframePreview";

interface DashboardProps {
  initialStyleGuide: string;
}

export default function Dashboard({ initialStyleGuide }: DashboardProps) {
  const [theme, setTheme] = useState("");
  const [styleGuide, setStyleGuide] = useState(initialStyleGuide);
  const [format, setFormat] = useState<"feed" | "stories">("feed");
  const [activeSlide, setActiveSlide] = useState(0);
  const [generatedData, setGeneratedData] = useState<{ html: string; caption: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "caption" | "code">("preview");

  // Funções de tratamento de clique e requisições HTTP:
  // - handleGenerate() aciona /api/generate
  // - handleExport() aciona /api/render
  // - handleCopy(text) copia legenda ou código
}
```

## Checklist de Implementação
- [x] 1. Criar o arquivo do componente interativo `src/components/Dashboard.tsx`.
- [x] 2. Importar `React`, `useState` e os ícones úteis de `lucide-react` (ex: `Sparkles`, `Download`, `Copy`, `ChevronLeft`, `ChevronRight`, `Image`, `FileText`, `Code`).
- [x] 3. Implementar a estrutura visual em `Dashboard.tsx` utilizando tags semânticas (sidebar para formulários, main para as abas de exibição).
- [x] 4. Integrar o componente `IframePreview` na aba de visualização passando a string HTML, o slide ativo e o formato selecionado.
- [x] 5. Implementar a função `handleGenerate` para fazer o POST para `/api/generate` atualizando os estados de progresso ("Gerando conteúdo com IA...", etc.) e preenchendo o HTML e legenda resultantes.
- [x] 6. Implementar a função `handleExport` para fazer a chamada binária para `/api/render`, convertendo a resposta em `Blob`, simulando o clique do link para download automático e limpando URLs temporárias da memória.
- [x] 7. Implementar botões de navegação de slide (anterior/próximo) e contador (ex: `Slide X de Y`), que devem ser calculados dinamicamente com base na contagem de ocorrências de divs com a classe `.slide` no HTML gerado.
- [x] 8. Implementar funcionalidade de cópia de texto com feedback de status ("Copiado!") tanto para a legenda em Markdown quanto para o código HTML.
- [x] 9. Modificar `src/app/page.tsx` para se tornar um Server Component importando `readStyleGuide` de `@/services/style` e renderizando o componente `<Dashboard initialStyleGuide={...} />`.
- [x] 10. Atualizar `src/app/layout.tsx` definindo metadados adequados e ajustando as classes padrão para combinar com o layout escuro.
- [x] 11. Substituir todo o conteúdo de `src/app/globals.css` pelo sistema de estilo escuro premium customizado:
  - Definir cores de variáveis CSS no `:root` (fundo principal, cards, acentos, bordas).
  - Estilizar a barra de navegação, sidebar de formulários, botões de ação e tabs.
  - Implementar estilos para loaders, animações de progresso e botões desabilitados.
- [x] 12. Rodar o projeto em modo desenvolvimento `npm run dev` na porta padrão.
- [x] 13. Abrir o painel no navegador e realizar um teste completo de ponta a ponta: gerar carrossel a partir de um tema, checar o preview dos slides no iframe, navegar pelos mesmos, copiar a legenda markdown, copiar o HTML de código e exportar o ZIP contendo as imagens e a legenda.
- [x] 14. Verificar a ausência de warnings de lint ou linter do Next.js rodando `npm run lint`.
- [x] 15. Executar a checagem geral de compilador do TypeScript usando `npx tsc --noEmit` para garantir conformidade total de tipos antes de concluir a entrega.

