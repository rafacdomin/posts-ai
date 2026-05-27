import React from "react";

interface IframePreviewProps {
  html: string;
  activeSlideIndex: number;
  format: "feed" | "stories";
}

function injectActiveSlideStyle(rawHtml: string, activeSlideIndex: number): string {
  const styleOverride = `
<style id="preview-slide-override">
  .slide { display: none !important; }
  .slide:nth-child(${activeSlideIndex + 1}) { display: flex !important; }
</style>
`;

  if (rawHtml.includes("</head>")) {
    return rawHtml.replace("</head>", `${styleOverride}</head>`);
  }
  return rawHtml + styleOverride;
}

export default function IframePreview({ html, activeSlideIndex, format }: IframePreviewProps) {
  const injectedHtml = injectActiveSlideStyle(html, activeSlideIndex);

  // Definir dimensões nominais (resolução cheia do slide) e simuladas (visualização no painel)
  const isFeed = format === "feed";
  
  const width = 1080;
  const height = isFeed ? 1350 : 1920;
  
  // Escala para caber no container do dashboard
  const scale = isFeed ? 1 / 3 : 1 / 4; 
  const containerWidth = isFeed ? 360 : 270;
  const containerHeight = isFeed ? 450 : 480;

  return (
    <div
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        background: "#121214",
        transition: "width 0.3s ease, height 0.3s ease",
      }}
    >
      <iframe
        title="Carousel Preview"
        srcDoc={injectedHtml}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "absolute",
          top: 0,
          left: 0,
          border: "none",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}
