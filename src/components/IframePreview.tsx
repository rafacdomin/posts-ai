import React, { useState, useEffect, useRef } from "react";
import { SLIDE_DIMENSIONS } from "@/constants";

interface IframePreviewProps {
  html: string;
  activeSlideIndex: number;
  format: "feed" | "stories";
}

function injectActiveSlideStyle(rawHtml: string, activeSlideIndex: number): string {
  const styleOverride = `
<style id="preview-slide-override">
  /* Forçar html e body a não apresentarem barra de rolagem e preencherem toda a viewport */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    width: 100% !important;
    height: 100% !important;
  }
  .slide { 
    display: none !important; 
    margin: 0 !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
  }
  .slide:nth-of-type(${activeSlideIndex + 1}) { 
    display: flex !important; 
  }
</style>
`;

  if (rawHtml.includes("</head>")) {
    return rawHtml.replace("</head>", `${styleOverride}</head>`);
  }
  return rawHtml + styleOverride;
}

export default function IframePreview({ html, activeSlideIndex, format }: IframePreviewProps) {
  const injectedHtml = injectActiveSlideStyle(html, activeSlideIndex);

  const isFeed = format === "feed";
  const width = SLIDE_DIMENSIONS.width;
  const height = isFeed ? SLIDE_DIMENSIONS.feedHeight : SLIDE_DIMENSIONS.storiesHeight;

  // Largura máxima nominal (desktop)
  const maxContainerWidth = isFeed ? SLIDE_DIMENSIONS.feedMaxContainerWidth : SLIDE_DIMENSIONS.storiesMaxContainerWidth;

  // Estado para largura dinâmica do display (responsivo)
  const [displayWidth, setDisplayWidth] = useState<number>(maxContainerWidth);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Monitorar redimensionamento do contêiner pai para recalcular escala em telas menores (mobile)
  useEffect(() => {
    if (!wrapperRef.current) return;

    const updateSize = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        // A largura real disponível no contêiner flex/grid pai
        const parentWidth = wrapperRef.current.parentElement
          ? wrapperRef.current.parentElement.getBoundingClientRect().width
          : rect.width;

        // Se o espaço disponível for menor que a largura nominal, comprime de forma responsiva
        const targetWidth = Math.min(maxContainerWidth, parentWidth > 0 ? parentWidth : rect.width);
        setDisplayWidth(targetWidth);
      }
    };

    updateSize();

    // ResizeObserver para recalcular sempre que a janela ou contêiner mudar
    const observer = new ResizeObserver(updateSize);
    if (wrapperRef.current.parentElement) {
      observer.observe(wrapperRef.current.parentElement);
    } else {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, [format, maxContainerWidth]);

  // Cálculos dinâmicos com base na largura disponível
  const dynamicScale = displayWidth / width;
  const displayHeight = displayWidth * (height / width);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: `${displayWidth}px`,
        maxWidth: `${maxContainerWidth}px`,
        height: `${displayHeight}px`,
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        background: "#121214",
        transition: "width 0.2s ease, height 0.2s ease", // Transição suave de largura e altura ao mudar de formato
      }}
    >
      <iframe
        title="Carousel Preview"
        srcDoc={injectedHtml}
        sandbox="allow-same-origin"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "absolute",
          top: 0,
          left: 0,
          border: "none",
          transform: `scale(${dynamicScale})`,
          transformOrigin: "top left",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}
