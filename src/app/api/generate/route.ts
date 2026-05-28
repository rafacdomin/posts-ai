import { NextResponse } from "next/server";
import { createAIService } from "@/services/ai";
import { readStyleGuide } from "@/services/style";
import { GenerateRequest } from "@/types";

export async function POST(request: Request): Promise<Response> {
  console.log("\n[POST /api/generate] Nova requisição recebida no servidor.");
  let body: GenerateRequest;

  // 1. Validar se o body é um JSON válido
  try {
    body = await request.json() as GenerateRequest;
  } catch {
    console.warn("[POST /api/generate] Corpo do request não é um JSON válido.");
    return NextResponse.json(
      { success: false, error: "Requisição inválida. O corpo do request deve estar no formato JSON." },
      { status: 400 }
    );
  }

  const { theme, styleGuide } = body;

  // 2. Validar que o campo theme é obrigatório e válido
  if (!theme || typeof theme !== "string" || theme.trim().length === 0) {
    console.warn("[POST /api/generate] Validação falhou: Tema ausente ou vazio.");
    return NextResponse.json(
      { success: false, error: "O campo 'theme' é obrigatório e deve ser uma string não vazia." },
      { status: 400 }
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[POST /api/generate] Parâmetros válidos. Tema solicitado: "${theme.substring(0, 60)}..."`);
  }

  try {
    // 3. Obter estilo visual (se enviado no body, usa ele; senão, lê o local/fallback)
    let resolvedStyle = styleGuide;
    if (!resolvedStyle || typeof resolvedStyle !== "string" || resolvedStyle.trim().length === 0) {
      console.log("[POST /api/generate] StyleGuide não enviado no body. Lendo arquivo local/fallback...");
      resolvedStyle = await readStyleGuide();
    } else {
      console.log("[POST /api/generate] Utilizando StyleGuide customizado enviado no body.");
    }

    // 4. Instanciar serviço de IA e gerar
    console.log("[POST /api/generate] Acionando OpenRouterAIService...");
    const aiService = createAIService();
    const result = await aiService.generateCarousel(theme.trim(), resolvedStyle);

    // 5. Retornar resposta de sucesso
    console.log("[POST /api/generate] Geração realizada com sucesso. Retornando dados ao cliente.");
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/generate] Erro durante o processo de geração:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
