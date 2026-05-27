"use client";

import React, { useState } from "react";
import { Sparkles, Download, Copy, ChevronLeft, ChevronRight, Eye, FileText, Code, Check } from "lucide-react";
import IframePreview from "@/components/IframePreview";

interface DashboardProps {
  initialStyleGuide: string;
}

export default function Dashboard({ initialStyleGuide }: DashboardProps) {
  const [theme, setTheme] = useState("");
  const [styleGuide, setStyleGuide] = useState(initialStyleGuide);
  const [format, setFormat] = useState<"feed" | "stories">("feed");
  const [activeSlide, setActiveSlide] = useState(0);
  const [generatedData, setGeneratedData] = useState<{ html: string; caption: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "caption" | "code">("preview");
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  // Calcular quantidade de slides no HTML gerado
  const matches = generatedData?.html ? generatedData.html.match(/class=["'][^"']*slide[^"']*["']/g) : null;
  const slideCount = matches ? matches.length : 0;

  // Função para copiar texto para a área de transferência
  const copyToClipboard = async (text: string, type: "caption" | "code") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "caption") {
        setCopiedCaption(true);
        setTimeout(() => setCopiedCaption(false), 2000);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch {
      alert("Erro ao copiar texto.");
    }
  };

  // Enviar tema e estilo para a API de geração
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;

    setLoading(true);
    setErrorText("");
    setGeneratedData(null);
    setStatusText("Conectando ao OpenRouter...");

    try {
      // Simulando atualização do status
      const statusInterval = setInterval(() => {
        setStatusText((prev) => {
          if (prev.includes("Conectando")) return "Analisando tema e manual de estilo...";
          if (prev.includes("Analisando")) return "Estruturando roteiro e narrativas dos slides...";
          if (prev.includes("Estruturando")) return "Construindo HTML, estilização CSS e copywriting da legenda...";
          return "Finalizando respostas...";
        });
      }, 3000);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme: theme.trim(),
          styleGuide: styleGuide.trim(),
        }),
      });

      clearInterval(statusInterval);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Ocorreu um erro desconhecido durante a geração.");
      }

      setGeneratedData(result.data);
      setActiveSlide(0);
      setActiveTab("preview");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setErrorText(errorMessage);
    } finally {
      setLoading(false);
      setStatusText("");
    }
  };

  // Enviar HTML e legenda para a API de renderização (Playwright)
  const handleExport = async () => {
    if (!generatedData) return;

    setExporting(true);
    setErrorText("");
    setStatusText("Inicializando navegador Playwright no backend...");

    try {
      const statusInterval = setInterval(() => {
        setStatusText((prev) => {
          if (prev.includes("Inicializando")) return "Carregando código HTML e importando fontes da web...";
          if (prev.includes("Carregando")) return "Capturando prints em alta definição dos slides (.slide)...";
          if (prev.includes("Capturando")) return "Empacotando imagens PNG e legenda.md em arquivo ZIP...";
          return "Iniciando download...";
        });
      }, 4000);

      const response = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: generatedData.html,
          caption: generatedData.caption,
          format: format,
        }),
      });

      clearInterval(statusInterval);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Falha ao gerar os criativos.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `carrossel-${format}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setErrorText(errorMessage);
    } finally {
      setExporting(false);
      setStatusText("");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar de Entradas */}
      <aside className="dashboard-sidebar">
        <div className="brand-header">
          <div className="brand-logo">✨</div>
          <div>
            <h1 className="brand-title">Posts AI</h1>
            <p className="brand-subtitle">Gerador de Carrosséis</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="dashboard-form">
          <div className="form-group">
            <label htmlFor="theme" className="form-label">
              Qual é o Tema ou Roteiro do Post?
            </label>
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
            <label htmlFor="styleGuide" className="form-label">
              Manual de Estilo da Marca (Design Guide Markdown)
            </label>
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
            <span>{loading ? "Gerando..." : "Gerar Carrossel"}</span>
          </button>
        </form>
      </aside>

      {/* Área Principal de Exibição / Abas */}
      <main className="dashboard-main">
        {loading || exporting ? (
          <div className="status-container">
            <div className="status-card">
              <div className="spinner"></div>
              <p className="status-headline">{loading ? "Gerando Carrossel com IA" : "Exportando Criativos"}</p>
              <p className="status-subtext">{statusText}</p>
            </div>
          </div>
        ) : errorText ? (
          <div className="status-container">
            <div className="status-card error-card">
              <div className="error-icon">⚠️</div>
              <p className="status-headline">Ocorreu um Erro</p>
              <p className="error-message">{errorText}</p>
              <button onClick={() => setErrorText("")} className="retry-btn">
                Entendido
              </button>
            </div>
          </div>
        ) : generatedData ? (
          <div className="content-container">
            {/* Cabeçalho do Editor */}
            <div className="content-header">
              <div className="tabs-container">
                <button
                  className={`tab-link ${activeTab === "preview" ? "active" : ""}`}
                  onClick={() => setActiveTab("preview")}
                >
                  <Eye size={16} />
                  <span>Visualização</span>
                </button>
                <button
                  className={`tab-link ${activeTab === "caption" ? "active" : ""}`}
                  onClick={() => setActiveTab("caption")}
                >
                  <FileText size={16} />
                  <span>Legenda</span>
                </button>
                <button
                  className={`tab-link ${activeTab === "code" ? "active" : ""}`}
                  onClick={() => setActiveTab("code")}
                >
                  <Code size={16} />
                  <span>Código HTML</span>
                </button>
              </div>

              <button onClick={handleExport} className="export-btn">
                <Download size={16} />
                <span>Exportar ZIP (PNGs)</span>
              </button>
            </div>

            {/* Conteúdo Ativo por Aba */}
            <div className="content-body">
              {activeTab === "preview" && (
                <div className="preview-tab-content">
                  <div className="preview-display">
                    <IframePreview
                      html={generatedData.html}
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
              )}

              {activeTab === "caption" && (
                <div className="caption-tab-content">
                  <div className="tab-actions">
                    <button
                      onClick={() => copyToClipboard(generatedData.caption, "caption")}
                      className="action-copy-btn"
                    >
                      {copiedCaption ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedCaption ? "Copiado!" : "Copiar Legenda"}</span>
                    </button>
                  </div>
                  <pre className="caption-display">{generatedData.caption}</pre>
                </div>
              )}

              {activeTab === "code" && (
                <div className="code-tab-content">
                  <div className="tab-actions">
                    <button
                      onClick={() => copyToClipboard(generatedData.html, "code")}
                      className="action-copy-btn"
                    >
                      {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedCode ? "Copiado!" : "Copiar Código HTML"}</span>
                    </button>
                  </div>
                  <pre className="code-display">
                    <code>{generatedData.html}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-container">
            <div className="empty-placeholder">
              <div className="placeholder-icon">🎨</div>
              <h2 className="placeholder-title">Nenhum Post Gerado Ainda</h2>
              <p className="placeholder-subtitle">
                Digite um tema na barra lateral e clique em <strong>Gerar Carrossel</strong> para criar seus slides e legenda com Inteligência Artificial.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
