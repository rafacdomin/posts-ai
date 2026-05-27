import fs from "fs/promises";
import path from "path";

export const DEFAULT_STYLE_FALLBACK = `# Identidade — Criador Solo (Estilo Quente & Editorial)

> Identidade visual padrão de marca de criador solo pessoal terroso.

## Cores
- **Fundo principal:** #FAF7F2 (Off-white quente)
- **Cor de destaque / CTA:** #C96442 (Terracota)
- **Texto principal:** #1C1917 (Grafite escuro)
- **Fundo alternativo / cards:** #F3EFE8 (Areia suave)
- **Cor proibida:** azul elétrico, cores muito saturadas

## Tipografia
- **Títulos e destaques:** Instrument Serif (italic, weight 400)
- **Corpo, subtítulos e botões:** Bricolage Grotesque (weight 400-700)
- **Peso do título:** regular italic (a leveza é parte do estilo)

## Estilo geral
Quente, humano e editorial. Tons terrosos com fundo off-white. Parece um livro bonito ou um diário de marca pessoal. O terracota (#C96442) aparece em CTAs, pills e destaques de texto.

## Elementos-chave
- Bordas: dashed (ex: 1.5px dashed rgba(28,25,23,0.15))
- Border-radius dos cards: 20px
- Botões: pill com border-radius: 50px, fundo terracota (#C96442)
- Sombras: sutil (0 4px 20px rgba(0,0,0,0.06))

## O que NUNCA fazer
- Fundo branco puro (#FFFFFF) — usar sempre o off-white (#FAF7F2)
- Bordas retas (solid sem radius) — parece corporativo e genérico
- Amarelo-limão como acento — destoa do tom quente
`;

export async function readStyleGuide(): Promise<string> {
  const filePath = path.join(process.cwd(), "identidade", "design-guide.md");
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data.trim() || DEFAULT_STYLE_FALLBACK;
  } catch {
    // Se o arquivo não existir (ENOENT) ou houver outro erro, retorna o fallback de forma graciosa
    return DEFAULT_STYLE_FALLBACK;
  }
}
