import { useState, useEffect, useCallback } from "react";
import { SIDEBAR } from "@/constants";

export function useResizableSidebar() {
  const [sidebarWidth, setSidebarWidth] = useState<number>(SIDEBAR.defaultWidth);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const maxWidth = Math.min(SIDEBAR.maxWidth, window.innerWidth * SIDEBAR.maxViewportRatio);
      const newWidth = Math.max(SIDEBAR.minWidth, Math.min(maxWidth, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Disable iframe pointer events during dragging to avoid losing move events inside the iframe
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.style.pointerEvents = "none";
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      iframes.forEach((iframe) => {
        iframe.style.pointerEvents = "auto";
      });
    };
  }, [isResizing]);

  return { sidebarWidth, isResizing, startResizing };
}
