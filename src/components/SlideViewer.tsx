import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import IframePreview from "./IframePreview";

interface SlideViewerProps {
  html: string;
  activeSlide: number;
  setActiveSlide: React.Dispatch<React.SetStateAction<number>>;
  slideCount: number;
  format: "feed" | "stories";
}

export default function SlideViewer({
  html,
  activeSlide,
  setActiveSlide,
  slideCount,
  format,
}: SlideViewerProps) {
  return (
    <div className="preview-tab-content">
      <div className="preview-display">
        <IframePreview
          html={html}
          activeSlideIndex={activeSlide}
          format={format}
        />
      </div>

      {/* Controles de Navegação */}
      {slideCount > 0 && (
        <div className="preview-controls">
          <button
            onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
            disabled={activeSlide === 0}
            className="control-nav-btn"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="slide-indicator">
            Slide {activeSlide + 1} de {slideCount}
          </span>
          <button
            onClick={() => setActiveSlide((prev) => Math.min(slideCount - 1, prev + 1))}
            disabled={activeSlide === slideCount - 1}
            className="control-nav-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
