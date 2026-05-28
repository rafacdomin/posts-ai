import { CarouselData } from "@/types";
import { AIService } from "./index";

export class OpenRouterAIService implements AIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || "";
    this.model = process.env.DEFAULT_AI_MODEL || "anthropic/claude-3.5-sonnet";
  }

  async generateCarousel(theme: string, styleGuide: string): Promise<CarouselData> {
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
- NUNCA inclua markdown adicional ou caracteres extras antes ou depois do JSON (não coloque \`\`\`json ou \`\`\` na sua resposta). Responda com JSON puro e limpo.
- NUNCA use media queries (@media) no CSS. Os slides devem ser rígidos e manter o tamanho exato de --slide-width e --slide-height sem nenhuma adaptação responsiva interna. A responsividade e o escalonamento do preview e da renderização são controlados de forma externa.
- IMPORTANTE: Seja conciso e focado no código necessário. Evite repetir grandes blocos de regras CSS ou comentários desnecessários. A resposta inteira (HTML + Legenda) deve conter no máximo 4 a 5 slides e caber em até 3000 tokens para evitar cortes prematuros no JSON.`;

    const userPrompt = `TEMA:
${theme}

GUIA DE ESTILO:
${styleGuide}`;

    console.log(`[AIService] Modelo alvo: ${this.model}`);
    console.log(`[AIService] Chave API configurada (tamanho): ${this.apiKey.length} caracteres.`);
    console.log("[AIService] Configurando requisição para OpenRouter com timeout de 60 segundos...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("[AIService] Tempo limite de requisição excedido (Timeout 60s). Abortando requisição...");
      controller.abort();
    }, 60000);

    try {
      console.log("[AIService] Enviando requisição HTTP POST para OpenRouter...");
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
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
          temperature: 0.7,
          max_tokens: 4096 // Garante limite alto para evitar truncamento prematuro
        })
      });

      clearTimeout(timeoutId);
      console.log(`[AIService] Resposta recebida do OpenRouter. Status HTTP: ${response.status} (${response.statusText})`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[AIService] Resposta HTTP de erro do OpenRouter:`, errorText);
        throw new Error(`Falha na resposta do OpenRouter (${response.status}): ${errorText}`);
      }

      console.log("[AIService] Lendo corpo da resposta (JSON)...");
      const data = await response.json();
      console.log("[AIService] Resposta convertida com sucesso.");

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

      console.log("[AIService] Sanitizando caracteres de controle inválidos do JSON...");
      const sanitizedJsonString = escapeControlCharsInStrings(cleanJsonString);

      console.log("[AIService] Validando e reparando possíveis truncamentos de tokens no JSON...");
      const repairedJsonString = repairTruncatedJson(sanitizedJsonString);

      let parsed: Partial<CarouselData>;
      try {
        parsed = JSON.parse(repairedJsonString);
      } catch (parseError) {
        console.error("[AIService] Falha ao fazer o parse do JSON retornado pela IA.");
        console.error("[AIService] JSON sanitizado e reparado tentado:", repairedJsonString);
        throw parseError;
      }

      if (!parsed.html) {
        throw new Error("O JSON retornado pela IA está incompleto (falta a chave 'html').");
      }

      if (!parsed.caption) {
        console.warn("[AIService] Legenda ('caption') ausente ou truncada no JSON. Utilizando legenda de fallback.");
        parsed.caption = `🚀 **Carrossel Gerado com Sucesso!**\n\nEste post foi criado automaticamente de acordo com o tema solicitado: **${theme}**.\n\n#ia #design #conteudo #performance`;
      }

      return parsed as CarouselData;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("[AIService] Erro na chamada de AIService:", error);
      throw new Error(`Falha na geração do carrossel pela IA: ${errorMessage}`);
    }
  }
}

export function escapeControlCharsInStrings(jsonStr: string): string {
  let result = "";
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];

    if (inString) {
      if (isEscaped) {
        result += char;
        isEscaped = false;
      } else if (char === "\\") {
        result += char;
        isEscaped = true;
      } else if (char === '"') {
        result += char;
        inString = false;
      } else {
        const code = char.charCodeAt(0);
        if (code < 32) {
          if (char === "\n") {
            result += "\\n";
          } else if (char === "\r") {
            result += "\\r";
          } else if (char === "\t") {
            result += "\\t";
          } else {
            result += "\\u" + code.toString(16).padStart(4, "0");
          }
        } else {
          result += char;
        }
      }
    } else {
      if (char === '"') {
        inString = true;
      }
      result += char;
    }
  }
  return result;
}

export function repairTruncatedJson(str: string): string {
  let inString = false;
  let isEscaped = false;
  const stack: ("{" | "[")[] = [];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === '"') {
        inString = false;
      }
    } else {
      if (char === '"') {
        inString = true;
      } else if (char === "{") {
        stack.push("{");
      } else if (char === "[") {
        stack.push("[");
      } else if (char === "}") {
        if (stack[stack.length - 1] === "{") {
          stack.pop();
        }
      } else if (char === "]") {
        if (stack[stack.length - 1] === "[") {
          stack.pop();
        }
      }
    }
  }

  let repaired = str;
  if (inString) {
    if (isEscaped) {
      repaired = repaired.slice(0, -1);
    }
    repaired += '"';
  }

  while (stack.length > 0) {
    const openSymbol = stack.pop();
    if (openSymbol === "{") {
      repaired += "}";
    } else if (openSymbol === "[") {
      repaired += "]";
    }
  }

  return repaired;
}
