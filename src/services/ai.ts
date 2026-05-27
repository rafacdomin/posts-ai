export interface AIServiceResponse {
  html: string;
  caption: string;
}

export interface AIService {
  generateCarousel(theme: string, styleGuide: string): Promise<AIServiceResponse>;
}

export class OpenRouterAIService implements AIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || "";
    this.model = process.env.DEFAULT_AI_MODEL || "anthropic/claude-3.5-sonnet";
  }

  async generateCarousel(theme: string, styleGuide: string): Promise<AIServiceResponse> {
    if (!this.apiKey) {
      throw new Error("Erro de Servidor: A variável de ambiente OPENROUTER_API_KEY não foi configurada.");
    }

    const systemPrompt = `Você é um designer gráfico e copywriter profissional especialista em redes sociais (Instagram). 
Sua tarefa é criar um carrossel de slides em HTML + CSS e uma legenda persuasiva com base no TEMA fornecido pelo usuário e respeitando rigorosamente o GUIA DE ESTILO da marca.

Você deve responder estritamente com um objeto JSON válido, contendo duas chaves:
1. "html": Uma string contendo um documento HTML completo e autossuficiente (incluindo tags <!DOCTYPE html>, <html>, <head>, <style>, <body>).
2. "caption": Uma string contendo a legenda do post em Markdown, ideal para o Instagram, com um gancho inicial forte, emojis apropriados e hashtags relevantes no final.

Diretrizes Críticas para o HTML/CSS:
- O HTML deve conter uma série de divs com a classe "slide" (ex: <div class="slide" id="slide-1">...</div>). Cada slide representa uma imagem individual do carrossel.
- O CSS deve ser embutido em uma única tag <style> no <head>. Não use links de estilos externos além de fontes do Google Fonts (carregadas via @import no início do CSS).
- Use as variáveis CSS na raiz (:root) para definir as dimensões do slide de acordo com as seguintes regras de proporção (por padrão use Feed):
  :root {
    --slide-width: 1080px;
    --slide-height: 1350px; /* Alterado para 1920px quando renderizado para Stories */
  }
- Cada div ".slide" deve ler estas variáveis:
  .slide {
    width: var(--slide-width);
    height: var(--slide-height);
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 90px 70px;
  }
- O design deve ser premium, moderno e dinâmico, adaptando o GUIA DE ESTILO:
  - Slide 1: Título gigante e chamativo com gancho de atenção.
  - Slides intermediários (2 a 4 ou 5): Conteúdo principal do carrossel estruturado com cards, listas, tipografias contrastantes e design editorial.
  - Slide final: Call to Action (CTA) nítido direcionando para seguir, salvar ou interagir.
  - Numeração visível de slides no rodapé (ex: "1/5") e uma barra de progresso visual fina.
- Certifique-se de que o texto tenha contraste perfeito com o fundo e não transborde dos limites do slide.
- NUNCA inclua markdown adicional ou caracteres extras antes ou depois do JSON (não coloque \`\`\`json ou \`\`\` na sua resposta). Responda com JSON puro e limpo.`;

    const userPrompt = `TEMA:
${theme}

GUIA DE ESTILO:
${styleGuide}`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/rafacdomin/posts-ai",
          "X-Title": "Posts AI Carousel Generator",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Falha na resposta do OpenRouter (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;

      if (!rawContent) {
        throw new Error("O OpenRouter retornou uma resposta sem conteúdo.");
      }

      // Limpar possíveis delimitadores de markdown caso o LLM os inclua apesar da instrução do sistema
      let cleanJsonString = rawContent.trim();
      if (cleanJsonString.startsWith("```json")) {
        cleanJsonString = cleanJsonString.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleanJsonString.startsWith("```")) {
        cleanJsonString = cleanJsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const parsed: AIServiceResponse = JSON.parse(cleanJsonString);

      if (!parsed.html || !parsed.caption) {
        throw new Error("O JSON retornado pela IA está incompleto (faltam chaves 'html' ou 'caption').");
      }

      return parsed;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Erro na chamada de AIService:", error);
      throw new Error(`Falha na geração do carrossel pela IA: ${errorMessage}`);
    }
  }
}
