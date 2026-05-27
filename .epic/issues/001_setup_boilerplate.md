# 001 — Setup do Boilerplate Next.js

## Objetivo
Configurar a estrutura básica do projeto Next.js com App Router, TypeScript, configuração de variáveis de ambiente e as dependências essenciais (`jszip`, `playwright`, `lucide-react`).

## Critérios de Aceite
- [ ] Boilerplate do Next.js (App Router) criado na raiz do projeto.
- [ ] Dependências instaladas e configuradas no `package.json`: `jszip`, `lucide-react`, `playwright`.
- [ ] Arquivos de configuração ajustados: `tsconfig.json` e `next.config.js`.
- [ ] Arquivo `.env.local.example` contendo as variáveis necessárias:
  - `OPENROUTER_API_KEY=`
  - `DEFAULT_AI_MODEL=anthropic/claude-3.5-sonnet`
- [ ] Pasta `identidade/` na raiz contendo um `design-guide.md` padrão preenchido (baseado no estilo "Criador Solo" quente/terroso).
- [ ] Script de conveniência no `package.json` para instalar o navegador Chromium do Playwright: `"postinstall": "playwright install chromium"`.

## Cenários de Teste
- [ ] Rodar `npm run dev` e garantir que o Next.js inicializa na porta 3000 sem erros de TypeScript ou linter.
- [ ] Validar que as variáveis de ambiente em `.env.local` (criado a partir do `.example`) são lidas com sucesso no código Next.js.
- [ ] Executar o comando de instalação do Playwright e certificar-se de que o Chromium foi instalado no ambiente.

## Arquivos a Criar/Modificar
- `[NEW]` [package.json](file:///home/rafacdomin/projetos/posts-ai/package.json)
- `[NEW]` [tsconfig.json](file:///home/rafacdomin/projetos/posts-ai/tsconfig.json)
- `[NEW]` [.gitignore](file:///home/rafacdomin/projetos/posts-ai/.gitignore)
- `[NEW]` [.env.local.example](file:///home/rafacdomin/projetos/posts-ai/.env.local.example)
- `[NEW]` [identidade/design-guide.md](file:///home/rafacdomin/projetos/posts-ai/identidade/design-guide.md)

## Dependências
- Nenhuma

## Estimativa
- P

## Pesquisa & Referências
- **Opções do CLI Next.js:** O comando `create-next-app` aceita flags como `--typescript`, `--eslint`, `--app`, `--src-dir`, `--no-tailwind`, `--use-npm` e `--yes` para automatizar a inicialização sem requerer interação no terminal.
- **Estratégia de Inicialização em Diretório Não Vazio:** Como o diretório raiz já contém pastas de agentes e especificações, utilizaremos um subdiretório temporário (`temp-next-app`) para inicialização e moveremos os arquivos gerados para o diretório raiz.
- **Playwright Setup:** O pacote `playwright` requer o download dos binários de navegadores. Adicionar um script no `package.json` (`postinstall`) garante que o Chromium necessário para renderizar os posts seja baixado de forma automática e integrada ao ciclo de desenvolvimento.

## Decisões Técnicas
- **Isolamento de Estilos:** Evitaremos o Tailwind CSS para o dashboard em prol de CSS Modules e Vanilla CSS para termos total flexibilidade e controle nos estilos e alinhamento com a preferência de layout expressa.
- **Instalação do Playwright:** Focamos na instalação exclusiva do Chromium (`playwright install chromium`) para economizar tempo de download e recursos no ambiente de execução, pois apenas o motor do Chromium é necessário para as capturas de tela.
- **Design Guide Inicial:** O arquivo `identidade/design-guide.md` será baseado no modelo de Criador Solo (tons quentes e terrosos) com fontes elegantes e tipografia sofisticada, provendo um ponto de partida atraente e estruturado para o LLM.

## Implementação Planejada

### Arquivos afetados
- `/package.json` — Modificação para adicionar dependências (`jszip`, `lucide-react`, `playwright`) e script `postinstall`.
- `/.env.local.example` — Criação do arquivo de modelo para variáveis de ambiente.
- `/identidade/design-guide.md` — Criação do guia de design do Criador Solo.

### Contrato de Variáveis de Ambiente (`.env.local.example`)
```bash
# OpenRouter API Credentials
OPENROUTER_API_KEY=

# Default AI Model for generation
DEFAULT_AI_MODEL=anthropic/claude-3.5-sonnet
```

### Script de Setup do Playwright (`package.json`)
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "postinstall": "playwright install chromium"
}
```

## Checklist de Implementação
- [x] 1. Criar um diretório temporário `temp-next-app` na raiz do projeto.
- [x] 2. Executar o comando `npx -y create-next-app@latest temp-next-app --typescript --eslint --app --src-dir --no-tailwind --use-npm --yes`.
- [x] 3. Mover todos os arquivos e pastas ocultas de `temp-next-app` para a raiz do workspace (incluindo `src/`, `public/`, `eslint.config.mjs`, `next.config.ts`, `package.json`, `tsconfig.json`, `next-env.d.ts`).
- [x] 4. Mesclar as entradas geradas de `.gitignore` com o `.gitignore` existente no projeto (mantendo regras de `.env.local` e `.next`).
- [x] 5. Remover o diretório temporário `temp-next-app` esvaziado.
- [x] 6. Modificar o arquivo `/package.json` para adicionar dependências extras (`jszip` e `lucide-react`).
- [x] 7. Adicionar o script `"postinstall": "playwright install chromium"` no arquivo `/package.json`.
- [x] 8. Executar `npm install` na raiz para consolidar e baixar todas as novas dependências (`jszip`, `lucide-react`, `playwright`).
- [x] 9. Executar `npx playwright install chromium` para certificar que o executável do Chromium está disponível na máquina local.
- [x] 10. Criar o arquivo `/.env.local.example` com os templates de variáveis de ambiente.
- [x] 11. Copiar o arquivo `/.env.local.example` para `/.env.local` (este arquivo será modificado manualmente depois com a API Key real).
- [x] 12. Criar a pasta `/identidade/` na raiz do projeto.
- [x] 13. Criar o arquivo `/identidade/design-guide.md` com a especificação visual detalhada do estilo Criador Solo terroso (cores, tipografia, bordas, restrições).
- [x] 14. Rodar o comando `npm run dev` para garantir que o servidor Next.js inicia corretamente na porta 3000.
- [x] 15. Acessar `http://localhost:3000` via curl ou navegador e verificar se a página padrão inicial do Next.js é exibida sem erros.
- [x] 16. Executar o linter `npm run lint` para garantir que o setup inicial do TypeScript/ESLint não contém erros de sintaxe ou configuração.

