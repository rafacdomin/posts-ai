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
  private useMock: boolean;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || "";
    this.model = process.env.DEFAULT_AI_MODEL || "anthropic/claude-3.5-sonnet";
    // Usa o mock se a variável de ambiente NEXT_PUBLIC_USE_MOCK for "true", ou se não estiver definida (default true)
    this.useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
  }

  async generateCarousel(theme: string, styleGuide: string): Promise<AIServiceResponse> {
    if (this.useMock) {
      console.log("[AIService] Geração de Carrossel MOCKADA ativa (Bypass OpenRouter).");
      console.log(`[AIService] Tema solicitado: "${theme}"`);
      console.log(`[AIService] Guia de estilo recebido (tamanho): ${styleGuide.length} caracteres.`);

      // Mock HTML fornecido pelo usuário
      const mockHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Design System em Aplicações Complexas</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
  --slide-width: 1080px;
  --slide-height: 1350px;
  --carbon-escuro: #0B0B0F;
  --carbon-medio: #1A1A22;
  --carbon-hover: #22222D;
  --laranja-cobre: #E35E2D;
  --branco-neve: #F8FAFC;
  --branco-suave: #E2E8F0;
  --cinza-sutil: #475569;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #050507;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Poppins', sans-serif;
}

.slide {
  width: var(--slide-width);
  height: var(--slide-height);
  background-color: var(--carbon-escuro);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 90px 70px;
  margin-bottom: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

/* Marca d'água */
.slide::before {
  content: 'DS';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Playfair Display', serif;
  font-size: 400px;
  font-weight: 600;
  color: var(--laranja-cobre);
  opacity: 0.03;
  pointer-events: none;
  z-index: 0;
}

.slide > * {
  position: relative;
  z-index: 1;
}

/* Barra de progresso no topo */
.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background: var(--laranja-cobre);
  border-radius: 0 2px 2px 0;
  z-index: 10;
}

/* Numeração de slides */
.slide-number {
  position: absolute;
  bottom: 30px;
  right: 70px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--branco-neve);
  opacity: 0.6;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* Assinatura */
.signature {
  position: absolute;
  bottom: 30px;
  left: 70px;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--branco-neve);
  opacity: 0.5;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* Régua separadora */
.ruler {
  width: 60px;
  height: 4px;
  background: var(--laranja-cobre);
  margin: 20px 0;
}

/* Conteúdo do slide */
.slide-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Slide 1 - Capa */
.slide-cover {
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, var(--carbon-escuro) 0%, #171720 50%, var(--carbon-escuro) 100%);
}

.slide-cover .tag {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--laranja-cobre);
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 30px;
  opacity: 0.9;
}

.slide-cover h1 {
  font-family: 'Playfair Display', serif;
  font-size: 82px;
  font-weight: 500;
  color: var(--branco-neve);
  line-height: 1.1;
  margin-bottom: 30px;
}

.slide-cover .subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 26px;
  font-weight: 300;
  color: var(--branco-suave);
  line-height: 1.5;
  max-width: 800px;
  opacity: 0.9;
}

.slide-cover .icon-large {
  font-size: 120px;
  margin-bottom: 40px;
  opacity: 0.3;
}

/* Slides intermediários */
.slide-inner {
  background-color: var(--carbon-escuro);
}

.slide-inner h2 {
  font-family: 'Playfair Display', serif;
  font-size: 52px;
  font-weight: 500;
  color: var(--branco-neve);
  line-height: 1.2;
  margin-bottom: 15px;
}

.slide-inner h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: var(--branco-neve);
  margin-bottom: 20px;
}

.slide-inner p {
  font-family: 'Poppins', sans-serif;
  font-size: 26px;
  font-weight: 300;
  color: var(--branco-suave);
  line-height: 1.6;
  margin-bottom: 25px;
}

.slide-inner ul {
  list-style: none;
  margin: 30px 0;
}

.slide-inner ul li {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 300;
  color: var(--branco-suave);
  line-height: 1.6;
  padding: 15px 0;
  padding-left: 40px;
  position: relative;
  border-bottom: 1px solid rgba(248, 250, 252, 0.08);
}

.slide-inner ul li:last-child {
  border-bottom: none;
}

.slide-inner ul li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--laranja-cobre);
  font-weight: 500;
  font-size: 24px;
}

/* Cards */
.card {
  background-color: var(--carbon-medio);
  border-radius: 16px;
  padding: 40px;
  margin: 20px 0;
  border: 1px solid rgba(248, 250, 252, 0.08);
}

.card h4 {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: var(--branco-neve);
  margin-bottom: 15px;
}

.card p {
  font-size: 24px;
  margin-bottom: 0;
}

/* Grid de benefícios */
.benefits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin: 30px 0;
}

.benefit-item {
  background: linear-gradient(135deg, var(--carbon-medio) 0%, rgba(26, 26, 34, 0.5) 100%);
  border-radius: 16px;
  padding: 35px;
  text-align: center;
  border: 1px solid rgba(248, 250, 252, 0.06);
}

.benefit-item .icon {
  font-size: 50px;
  margin-bottom: 20px;
  display: block;
}

.benefit-item h4 {
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--branco-neve);
  margin-bottom: 10px;
}

.benefit-item p {
  font-size: 18px;
  color: var(--branco-suave);
  opacity: 0.8;
  line-height: 1.4;
}

/* Slide CTA */
.slide-cta {
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(180deg, var(--carbon-escuro) 0%, #07070A 100%);
}

.slide-cta .logo-icon {
  width: 180px;
  height: 180px;
  background-color: var(--carbon-medio);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
  border: 2px solid rgba(227, 94, 45, 0.3);
}

.slide-cta .logo-icon span {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-weight: 600;
  color: var(--laranja-cobre);
}

.slide-cta h2 {
  font-family: 'Playfair Display', serif;
  font-size: 56px;
  font-weight: 500;
  color: var(--branco-neve);
  line-height: 1.2;
  margin-bottom: 20px;
}

.slide-cta p {
  font-family: 'Poppins', sans-serif;
  font-size: 26px;
  font-weight: 300;
  color: var(--branco-suave);
  line-height: 1.5;
  margin-bottom: 50px;
  opacity: 0.9;
}

.slide-cta .cta-button {
  display: inline-block;
  background-color: var(--laranja-cobre);
  color: var(--branco-neve);
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  padding: 22px 60px;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
  transition: all 300ms ease-out;
  text-decoration: none;
}

.slide-cta .cta-button:hover {
  transform: scale(1.05) translateY(-3px);
  box-shadow: 0 15px 40px rgba(227, 94, 45, 0.3);
}

/* Destaque de texto */
.highlight {
  color: var(--laranja-cobre);
  font-weight: 500;
}
</style>
</head>
<body>

<!-- Slide 1: Capa -->
<div class="slide slide-cover" id="slide-1">
  <div class="progress-bar" style="width: 20%;"></div>
  <div class="icon-large">◆</div>
  <div class="tag">Design System</div>
  <h1>A Base de<br>Aplicações<br>Complexas</h1>
  <div class="ruler"></div>
  <p class="subtitle">Como criar consistência, acessibilidade e escalabilidade em produtos digitais de alta performance</p>
  <span class="signature">@seu.perfil | Design System Expert</span>
  <span class="slide-number">1/5</span>
</div>

<!-- Slide 2: O que é Design System -->
<div class="slide slide-inner" id="slide-2">
  <div class="progress-bar" style="width: 40%;"></div>
  <div class="slide-content">
    <div class="tag" style="font-size: 14px; font-weight: 600; color: var(--laranja-cobre); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 20px; opacity: 0.8;">Fundamentos</div>
    <h2>O que é um<br>Design System?</h2>
    <div class="ruler"></div>
    <p>Um <span class="highlight">conjunto integrado</span> de componentes, padrões e documentação que guia o desenvolvimento de produtos digitais.</p>
    <ul>
      <li>Componentes reutilizáveis</li>
      <li>Guia de estilo consistente</li>
      <li>Documentação acessível</li>
      <li>Padrões de interação</li>
    </ul>
  </div>
  <span class="signature">@seu.perfil | Design System Expert</span>
  <span class="slide-number">2/5</span>
</div>

<!-- Slide 3: Benefícios -->
<div class="slide slide-inner" id="slide-3">
  <div class="progress-bar" style="width: 60%;"></div>
  <div class="slide-content">
    <div class="tag" style="font-size: 14px; font-weight: 600; color: var(--laranja-cobre); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 20px; opacity: 0.8;">Benefícios</div>
    <h2>Por que investir<br>em Design System?</h2>
    <div class="ruler"></div>
    <div class="benefits-grid">
      <div class="benefit-item">
        <span class="icon">◈</span>
        <h4>Consistência</h4>
        <p>Experiência unificada em todos os pontos de contato</p>
      </div>
      <div class="benefit-item">
        <span class="icon">◈</span>
        <h4>Acessibilidade</h4>
        <p>Padrões inclusivos desde a base do projeto</p>
      </div>
      <div class="benefit-item">
        <span class="icon">◈</span>
        <h4>Velocidade</h4>
        <p>Redução de até 50% no tempo de desenvolvimento</p>
      </div>
      <div class="benefit-item">
        <span class="icon">◈</span>
        <h4>Escalabilidade</h4>
        <p>Crescimento sustentável and organizado</p>
      </div>
    </div>
  </div>
  <span class="signature">@seu.perfil | Design System Expert</span>
  <span class="slide-number">3/5</span>
</div>

<!-- Slide 4: Impacto no Desenvolvimento -->
<div class="slide slide-inner" id="slide-4">
  <div class="progress-bar" style="width: 80%;"></div>
  <div class="slide-content">
    <div class="tag" style="font-size: 14px; font-weight: 600; color: var(--laranja-cobre); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 20px; opacity: 0.8;">Impacto</div>
    <h2>Resultados<br>Concretos</h2>
    <div class="ruler"></div>
    <div class="card">
      <h4>📊 50% Mais Rápido</h4>
      <p>Redução significativa no tempo de entrega de novas funcionalidades e interfaces.</p>
    </div>
    <div class="card">
      <h4>🎯 Zero Inconsistências</h4>
      <p>Eliminação de variações visuais e comportamentais entre diferentes partes do produto.</p>
    </div>
    <div class="card">
      <h4>🎯 Acessibilidade Nativa</h4>
      <p>Componentes já construídos seguindo as diretrizes WCAG e melhores práticas.</p>
    </div>
  </div>
  <span class="signature">@seu.perfil | Design System Expert</span>
  <span class="slide-number">4/5</span>
</div>

<!-- Slide 5: CTA -->
<div class="slide slide-cta" id="slide-5">
  <div class="progress-bar" style="width: 100%;"></div>
  <div class="logo-icon">
    <span>DS</span>
  </div>
  <h2>Comece a construir<br>seu Design System</h2>
  <p>Transforme a maneira como sua equipe<br>cria produtos digitais</p>
  <a href="#" class="cta-button">Salvar este post</a>
  <div style="margin-top: 40px;">
    <p style="font-size: 20px; opacity: 0.7;">Compartilhe com alguém que precisa ver isso ✨</p>
  </div>
  <span class="signature">@seu.perfil | Design System Expert</span>
  <span class="slide-number">5/5</span>
</div>

</body>
</html>`;

      const mockCaption = `**🚀 A Base de Aplicações Complexas**

Consistência, acessibilidade e velocidade são pilares cruciais na engenharia de software moderna. Descubra como estruturar um **Design System** sólido transforma o fluxo de equipes de alta performance.

1️⃣ **Consistência Visual** – Garante uma experiência homogênea em todas as telas.
2️⃣ **Velocidade de Entrega** – Redução de até 50% no tempo de codificação de interfaces.
3️⃣ **Acessibilidade Inclusiva** – Componentes projetados de acordo com as normas WCAG desde o início.
4️⃣ **Crescimento Saudável** – Facilidade em escalar produtos sem reescrever código legado.

💡 *Desenvolver de forma consistente poupa tempo, design e orçamento de engenharia.*

---
#DesignSystem #UXDesign #Frontend #ProductDesign #WebDevelopment #SoftwareEngineering #CleanCode #Consistencia`;

      return {
        html: mockHtml,
        caption: mockCaption
      };
    } else {
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

        let parsed: Partial<AIServiceResponse>;
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

        return parsed as AIServiceResponse;
      } catch (error: unknown) {
        clearTimeout(timeoutId);
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[AIService] Erro na chamada de AIService:", error);
        throw new Error(`Falha na geração do carrossel pela IA: ${errorMessage}`);
      }
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
