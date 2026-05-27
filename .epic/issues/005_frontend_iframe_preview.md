# 005 — Componente React de Preview (IframePreview)

## Objetivo
Implementar o componente React `IframePreview` para exibir de forma responsiva os slides gerados pela IA no dashboard, com navegação individual entre os slides e ajuste proporcional de tamanho (escala).

## Critérios de Aceite
- [ ] Criar o componente em `src/components/IframePreview.tsx` (ou `src/app/components/IframePreview.tsx` conforme a estrutura).
- [ ] O componente deve aceitar como props:
  - `html`: string (código HTML completo dos slides).
  - `activeSlideIndex`: número (índice 0-indexed do slide a exibir).
  - `format`: `"feed"` ou `"stories"` (define o aspect ratio).
- [ ] Injetar dinamicamente uma tag `<style>` no cabeçalho do HTML antes de passá-lo para a propriedade `srcDoc` do `<iframe>` para controlar a exibição do slide ativo:
  - Exemplo: `.slide { display: none !important; } .slide:nth-child(${activeSlideIndex + 1}) { display: flex !important; }`
- [ ] Ajustar o tamanho do `<iframe>` conforme o formato:
  - Feed: 1080px de largura por 1350px de altura.
  - Stories: 1080px de largura por 1920px de altura.
- [ ] Aplicar escala CSS (`transform: scale(...)` e `transform-origin`) para que o iframe caiba perfeitamente no container responsivo da UI, simulando a visualização em uma tela móvel de forma suave e sem barras de rolagem.

## Cenários de Teste
- [ ] Passar um HTML de teste com 3 slides e alternar o `activeSlideIndex` de 0 a 2. Verificar se apenas o slide correspondente é renderizado no iframe.
- [ ] Mudar o formato de "feed" para "stories" e certificar-se de que a proporção do iframe se reajusta instantaneamente na tela.
- [ ] Verificar o comportamento em telas menores (celular ou tablet) e validar se a escala CSS previne estouro de layout do container de preview.

## Arquivos a Criar/Modificar
- `[NEW]` [src/components/IframePreview.tsx](file:///home/rafacdomin/projetos/posts-ai/src/components/IframePreview.tsx)

## Dependências
- **001 — Setup do Boilerplate Next.js**

## Estimativa
- M

## Pesquisa & Referências
- **Propriedade srcDoc do Iframe:** A propriedade `srcDoc` do HTML5 permite renderizar conteúdo HTML dinâmico diretamente na página sem precisar apontar para um arquivo externo ou usar blobs de URL.
- **Transformações CSS (Scale):** O uso de `transform: scale(X)` permite reduzir visualmente o tamanho de um elemento sem mudar suas proporções internas ou comportamento de media queries, mantendo o design intacto.
- **Origem de Transformação:** A propriedade `transform-origin: top left` garante que o redimensionamento do iframe ocorra a partir do canto superior esquerdo, facilitando o alinhamento com o container pai absoluto.

## Decisões Técnicas
- **Escalabilidade Fixa Baseada em Aspect Ratio:** Adotaremos uma abordagem de simulação mobile com dimensões de container fixas e proporções matemáticas:
  - Feed (1080x1350): Container de `360px` x `450px` com escala exata de `0.333333` (`1/3`).
  - Stories (1080x1920): Container de `270px` x `480px` com escala exata de `0.25` (`1/4`).
  Esto garante que o preview caiba perfeitamente no dashboard sem consumir processamento de observers dinâmicos de Javascript e mantendo fidelidade total ao pixel original.
- **Injeção Não Destrutiva de CSS:** Modificaremos a string HTML injetando um bloco `<style>` temporário contendo regras de `display: none !important` para todos os slides, exceto o slide ativo (`:nth-child`). Isto evita a necessidade de gerenciar complexidades de comunicação pós-renderização (`postMessage`) entre o React e a janela do iframe.

## Implementação Planejada

### Assinatura do Componente em `src/components/IframePreview.tsx`
```typescript
import React from "react";

interface IframePreviewProps {
  html: string;
  activeSlideIndex: number;
  format: "feed" | "stories";
}

export default function IframePreview({ html, activeSlideIndex, format }: IframePreviewProps) {
  // 1. Injetar regras de exibição do slide ativo (.slide { display: none !important } .slide:nth-child(idx) { display: flex !important })
  // 2. Determinar dimensões reais e escala baseado no formato
  // 3. Renderizar container relativo com tamanho simulado e overflow hidden
  // 4. Renderizar iframe absoluto com tamanho nominal de alta resolução e escala CSS
}
```

## Checklist de Implementação
- [x] 1. Criar o diretório `src/components/` se ele não existir.
- [x] 2. Criar o arquivo `src/components/IframePreview.tsx`.
- [x] 3. Importar o módulo `React` e definir a interface `IframePreviewProps` com os campos `html`, `activeSlideIndex` e `format` tipados de forma estrita.
- [x] 4. Criar a função auxiliar `injectActiveSlideStyle` para ler a string HTML e inserir a tag `<style>` de exibição no fechamento de `</head>` (ou no final da string se a tag não existir).
- [x] 5. No componente principal `IframePreview`, executar a injeção de estilo na string de entrada.
- [x] 6. Definir as constantes de dimensões para o formato `feed` (largura: 1080, altura: 1350, escala: 1/3, largura container: 360, altura container: 450).
- [x] 7. Definir as constantes de dimensões para o formato `stories` (largura: 1080, altura: 1920, escala: 1/4, largura container: 270, altura container: 480).
- [x] 8. Selecionar os valores ativos baseando-se na prop `format`.
- [x] 9. Renderizar uma div externa (`container`) com estilos embutidos aplicando as dimensões simuladas (ex: `width: 360px`, `height: 450px`, `position: relative`, `overflow: hidden`, `border-radius: 16px`).
- [x] 10. Renderizar a tag `<iframe>` dentro do container com os seguintes atributos:
  - `srcDoc={injectedHtml}`
  - Estilos embutidos: `width: 1080px`, `height: 1350px` (ou 1920px), `position: absolute`, `top: 0`, `left: 0`, `border: none`, `transform: scale(X)`, `transform-origin: top left`.
- [x] 11. Adicionar uma tag `title="Carousel Preview"` no iframe para cumprir requisitos de acessibilidade do ESLint.
- [x] 12. Criar um arquivo de teste de componentização simples `/src/app/test-preview/page.tsx` para validação manual visual temporária.
- [x] 13. Iniciar o servidor com `npm run dev` e acessar `/test-preview` para checar se a renderização em iframe escala corretamente e navega entre slides sem crashar.
- [x] 14. Limpar o arquivo temporário de teste de componentização após a validação bem-sucedida.

