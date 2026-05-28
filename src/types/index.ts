export type SlideFormat = "feed" | "stories";

export interface CarouselData {
  html: string;
  caption: string;
}

export interface RenderRequest {
  html?: string;
  caption?: string;
  format?: SlideFormat;
}

export interface GenerateRequest {
  theme?: string;
  styleGuide?: string;
  format?: SlideFormat;
}
