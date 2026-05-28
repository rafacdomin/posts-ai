# 007 — Mover o Mock para a Tab "Exemplo"

## Objetivo
Mover o carrossel estático/mockado (estilo de design Obsidian & Copper) para uma aba fixa chamada "Exemplo" no painel principal, permitindo que os usuários tenham um modelo funcional de carrossel de referência desde a inicialização do app.

## Critérios de Aceite
- [ ] Adicionar a aba "Exemplo" como a última aba da lista (ordem: Visualização | Legenda | Código HTML | Exemplo).
- [ ] A aba "Exemplo" deve ficar habilitada e disponível para clique antes de qualquer geração de post.
- [ ] Quando selecionada, a aba "Exemplo" deve exibir apenas o preview do HTML do mock (`design-system-carousel.html`) com seus próprios controles de slide (não exibe legenda nem código para o mock).
- [ ] Manter o fluxo padrão atual: o aplicativo inicia com `generatedData === null` e a aba "Visualização" ativa por padrão, exibindo o placeholder vazio.
- [ ] Manter as abas "Visualização", "Legenda" e "Código HTML" desabilitadas antes da primeira geração de posts.
- [ ] Ao concluir com sucesso a geração por IA, a aba ativa deve ser redirecionada para a aba "Visualização" exibindo o post customizado.

## Cenários de Teste
- [ ] Navegar pelos slides do carrossel de exemplo e certificar-se de que a paginação funciona perfeitamente (1 de 5 até 5 de 5).
- [ ] Digitar um tema, clicar em gerar e constatar que a aba ativa muda para "Visualização" com o post customizado.
- [ ] Mudar para a aba "Exemplo" novamente e constatar que a paginação dela e a do post customizado são independentes.

## Arquivos a Criar/Modificar
- `[MODIFY]` [src/services/ai/mock-service.ts](file:///home/rafacdomin/projetos/posts-ai/src/services/ai/mock-service.ts)
- `[MODIFY]` [src/services/ai/index.ts](file:///home/rafacdomin/projetos/posts-ai/src/services/ai/index.ts)
- `[MODIFY]` [src/app/page.tsx](file:///home/rafacdomin/projetos/posts-ai/src/app/page.tsx)
- `[MODIFY]` [src/components/Dashboard.tsx](file:///home/rafacdomin/projetos/posts-ai/src/components/Dashboard.tsx)
- `[MODIFY]` [src/app/globals.css](file:///home/rafacdomin/projetos/posts-ai/src/app/globals.css)

## Dependências
- **006 — Implementação do Painel Principal (Dashboard UI) e Estilização**

## Estimativa
- P

## Pesquisa & Referências
- **Leitura de Mocks em Server Components:** Como `src/app/page.tsx` é um componente executado no servidor, podemos carregar arquivos de mock usando `fs` no Node.js diretamente e injetá-los como propriedades serializáveis no Dashboard.
- **Gerenciamento de Estados de Navegação Separados:** Para evitar conflito entre o slide atual de exemplo e o slide atual do post do usuário, cada visualizador de carrossel precisa rastrear seu próprio estado (`activeSlide` vs `activeExampleSlide`).

## Decisões Técnicas
- **Encapsulamento de Mock no Serviço:** Moveremos a lógica de leitura de arquivos mock de `MockAIService` para uma função exportada `getMockData(): Promise<CarouselData>` em `src/services/ai/mock-service.ts`.
- **UI de Abas Dinâmica:**
  - O estado `activeTab` passará a conter `"exemplo" | "preview" | "caption" | "code"`.
  - No início (`generatedData === null`), as abas `"preview" | "caption" | "code"` apresentarão estilos visuais desabilitados (`disabled-tab`) e cliques bloqueados.

## Implementação Planejada

### Função de Leitura de Mocks em `src/services/ai/mock-service.ts`
```typescript
export async function getMockData(): Promise<CarouselData> {
  const htmlPath = path.join(process.cwd(), "src", "services", "ai", "mocks", "design-system-carousel.html");
  const captionPath = path.join(process.cwd(), "src", "services", "ai", "mocks", "design-system-caption.md");
  const html = await fs.readFile(htmlPath, "utf-8");
  const caption = await fs.readFile(captionPath, "utf-8");
  return { html: html.trim(), caption: caption.trim() };
}
```

### Adaptação do `DashboardProps` em `src/components/Dashboard.tsx`
```typescript
interface DashboardProps {
  initialStyleGuide: string;
  mockHtml: string;
  mockCaption: string;
}
```

## Checklist de Implementação
- [x] 1. Refatorar `src/services/ai/mock-service.ts` para exportar a função `getMockData()`.
- [x] 2. Re-exportar `getMockData` em `src/services/ai/index.ts`.
- [x] 3. Atualizar `src/app/page.tsx` para importar `getMockData`, carregar o mock e injetá-lo no `Dashboard`.
- [x] 4. Atualizar interface `DashboardProps` no `Dashboard.tsx` para aceitar `mockHtml` (conforme refinado pelo usuário).
- [x] 5. Manter estado `activeTab` padrão para `"preview"` (conforme refinado pelo usuário).
- [x] 6. Criar estado independente `activeExampleSlide` no Dashboard.
- [x] 7. Injetar botão "Exemplo" no cabeçalho de abas (`content-header`).
- [x] 8. Renderizar layout de "Exemplo" contendo o `IframePreview` com `mockHtml` e controles de paginação específicos.
- [x] 9. Ajustar renderização das abas normais para que estejam presentes no carregamento inicial, porém estilizadas como desabilitadas se `generatedData` for nulo.
- [x] 10. Atualizar `handleGenerate` para alterar `activeTab` para `"preview"` após a conclusão do post.
- [x] 11. Adicionar estilos para a aba desabilitada no `globals.css` (ex: opacidade reduzida, cursor não permitido).
- [x] 12. Executar testes unitários e build de produção para certificar o funcionamento do pipeline.
