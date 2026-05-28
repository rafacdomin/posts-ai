import React from "react";
import { Sparkles, Copy, Check } from "lucide-react";

interface DashboardSidebarProps {
  theme: string;
  setTheme: (val: string) => void;
  styleGuide: string;
  setStyleGuide: (val: string) => void;
  format: "feed" | "stories";
  setFormat: (val: "feed" | "stories") => void;
  sidebarWidth: number;
  loading: boolean;
  exporting: boolean;
  copiedTheme: boolean;
  copiedStyleGuide: boolean;
  onCopy: (text: string, type: string) => void;
  onGenerate: (e: React.FormEvent) => void;
}

export default function DashboardSidebar({
  theme,
  setTheme,
  styleGuide,
  setStyleGuide,
  format,
  setFormat,
  sidebarWidth,
  loading,
  exporting,
  copiedTheme,
  copiedStyleGuide,
  onCopy,
  onGenerate,
}: DashboardSidebarProps) {
  return (
    <aside className="dashboard-sidebar" style={{ width: `${sidebarWidth}px` }}>
      <div className="brand-header">
        <div className="brand-logo">✨</div>
        <div>
          <h1 className="brand-title">Posts AI</h1>
          <p className="brand-subtitle">Gerador de Posts para o Instagram</p>
        </div>
      </div>

      <form onSubmit={onGenerate} className="dashboard-form">
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="theme" className="form-label">
              Qual é o Tema ou Roteiro do Post?
            </label>
            <button
              type="button"
              className="copy-input-btn"
              onClick={() => onCopy(theme, "theme")}
              disabled={!theme}
              title="Copiar Tema/Roteiro"
            >
              {copiedTheme ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <textarea
            id="theme"
            className="form-input text-area-theme"
            placeholder="Ex: 5 dicas essenciais para otimizar suas consultas SQL usando índices compostos..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            disabled={loading || exporting}
            required
          />
        </div>

        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="styleGuide" className="form-label">
              Manual de Estilo da Marca (Design Guide Markdown)
            </label>
            <button
              type="button"
              className="copy-input-btn"
              onClick={() => onCopy(styleGuide, "style")}
              disabled={!styleGuide}
              title="Copiar Manual de Estilo"
            >
              {copiedStyleGuide ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <textarea
            id="styleGuide"
            className="form-input text-area-style"
            placeholder="Insira as diretrizes visuais do post..."
            value={styleGuide}
            onChange={(e) => setStyleGuide(e.target.value)}
            disabled={loading || exporting}
          />
        </div>

        <div className="form-group">
          <span className="form-label">Formato de Exportação</span>
          <div className="format-toggle-group">
            <button
              type="button"
              className={`format-btn ${format === "feed" ? "active" : ""}`}
              onClick={() => setFormat("feed")}
              disabled={loading || exporting}
            >
              Feed (4:5)
            </button>
            <button
              type="button"
              className={`format-btn ${format === "stories" ? "active" : ""}`}
              onClick={() => setFormat("stories")}
              disabled={loading || exporting}
            >
              Stories (9:16)
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading || exporting || !theme.trim()}>
          <Sparkles size={18} />
          <span>{loading ? "Gerando..." : "Gerar Posts"}</span>
        </button>
      </form>
    </aside>
  );
}
