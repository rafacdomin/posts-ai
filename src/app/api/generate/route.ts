import { NextResponse } from "next/server";
import { OpenRouterAIService } from "@/services/ai";
import { readStyleGuide } from "@/services/style";

interface GenerateRequest {
  theme?: string;
  styleGuide?: string;
}

export async function POST(request: Request): Promise<Response> {
  let body: GenerateRequest;

  // 1. Validar se o body é um JSON válido
  try {
    body = await request.json() as GenerateRequest;
  } catch {
    return NextResponse.json(
      { success: false, error: "Requisição inválida. O corpo do request deve estar no formato JSON." },
      { status: 400 }
    );
  }

  const { theme, styleGuide } = body;

  // 2. Validar que o campo theme é obrigatório e válido
  if (!theme || typeof theme !== "string" || theme.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "O campo 'theme' é obrigatório e deve ser uma string não vazia." },
      { status: 400 }
    );
  }

  try {
    // 3. Obter estilo visual (se enviado no body, usa ele; senão, lê o local/fallback)
    let resolvedStyle = styleGuide;
    if (!resolvedStyle || typeof resolvedStyle !== "string" || resolvedStyle.trim().length === 0) {
      resolvedStyle = await readStyleGuide();
    }

    // 4. Instanciar serviço de IA e gerar
    const aiService = new OpenRouterAIService();
    const result = await aiService.generateCarousel(theme.trim(), resolvedStyle);

    // 5. Retornar resposta de sucesso
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
