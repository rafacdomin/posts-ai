import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { OpenRouterAIService } from "../src/services/ai";
import { readStyleGuide } from "../src/services/style";

async function main() {
  console.log("Carregando guia de estilo...");
  const style = await readStyleGuide();
  console.log("Guia de estilo carregado. Inicializando serviço de IA...");

  const ai = new OpenRouterAIService();
  console.log("Enviando solicitação de geração de carrossel...");

  try {
    const result = await ai.generateCarousel(
      "3 passos rápidos para otimizar suas consultas SQL com índices e performance",
      style
    );

    console.log("\n====================================");
    console.log("=== CONTEÚDO DA LEGENDA GERADA ===");
    console.log("====================================");
    console.log(result.caption);

    console.log("\n====================================");
    console.log("=== CÓDIGO HTML GERADO (TRUNCADO) ===");
    console.log("====================================");
    console.log(result.html.substring(0, 700) + "\n... [Restante do HTML Omitido]");
    console.log("\n[OK] Teste de integração finalizado com sucesso!");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("\n[ERRO] Falha ao testar a integração com IA:", errorMessage);
  }
}

main();
