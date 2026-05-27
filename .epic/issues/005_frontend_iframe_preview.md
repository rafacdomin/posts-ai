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
