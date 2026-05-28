import { useState, useCallback, useRef } from "react";

export function useClipboard() {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopiedType(null);
      }, 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      alert("Erro ao copiar texto.");
    }
  }, []);

  return { copiedType, copy };
}
