import * as fs from "fs/promises";
import * as path from "path";
import { AIService } from "./index";
import { CarouselData } from "@/types";

export class MockAIService implements AIService {
  async generateCarousel(theme: string, styleGuide: string): Promise<CarouselData> {
    console.log("[MockAIService] Geração de Carrossel MOCKADA ativa (Bypass OpenRouter).");
    console.log(`[MockAIService] Tema solicitado: "${theme}"`);
    console.log(`[MockAIService] Guia de estilo recebido (tamanho): ${styleGuide.length} caracteres.`);

    const htmlPath = path.join(process.cwd(), "src", "services", "ai", "mocks", "design-system-carousel.html");
    const captionPath = path.join(process.cwd(), "src", "services", "ai", "mocks", "design-system-caption.md");

    try {
      const html = await fs.readFile(htmlPath, "utf-8");
      const caption = await fs.readFile(captionPath, "utf-8");

      return {
        html: html.trim(),
        caption: caption.trim()
      };
    } catch (error) {
      console.error("[MockAIService] Erro ao ler os arquivos mock locais:", error);
      throw new Error(`Falha ao ler os arquivos mock locais: ${(error as Error).message}`);
    }
  }
}
