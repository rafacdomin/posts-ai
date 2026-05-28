import { CarouselData } from "@/types";
import { MockAIService } from "./mock-service";
import { OpenRouterAIService } from "./openrouter-service";

export { MockAIService, getMockData } from "./mock-service";
export { OpenRouterAIService } from "./openrouter-service";

export interface AIService {
  generateCarousel(theme: string, styleGuide: string): Promise<CarouselData>;
}

export function createAIService(): AIService {
  // Use mock if NEXT_PUBLIC_USE_MOCK is not "false"
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
  if (useMock) {
    return new MockAIService();
  }
  return new OpenRouterAIService();
}
