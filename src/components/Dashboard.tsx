"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Download, Copy, ChevronLeft, ChevronRight, Eye, FileText, Code, Check } from "lucide-react";
import IframePreview from "@/components/IframePreview";
import { useClipboard } from "@/hooks/useClipboard";
import { useResizableSidebar } from "@/hooks/useResizableSidebar";

interface DashboardProps {
  initialStyleGuide: string;
  mockHtml: string;
}

export default function Dashboard({ initialStyleGuide, mockHtml }: DashboardProps) {
  const [theme, setTheme] = useState("");
  const [styleGuide, setStyleGuide] = useState(initialStyleGuide);
  const [format, setFormat] = useState<"feed" | "stories">("feed");
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeExampleSlide, setActiveExampleSlide] = useState(0);
  const [generatedData, setGeneratedData] = useState<{ html: string; caption: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "caption" | "code" | "exemplo">("preview");

  const { copiedType, copy } = useClipboard();
  const { sidebarWidth, isResizing, startResizing } = useResizableSidebar();

  const copiedCaption = copiedType === "caption";
  const copiedCode = copiedType === "code";
  const copiedTheme = copiedType === "theme";
  const copiedStyleGuide = copiedType === "style";

  // Calcular quantidade de slides no HTML gerado (busca exatamente a classe "slide" separada por espaços)
  const slideCount = useMemo(() => {
    const matches = generatedData?.html ? generatedData.html.match(/class=["'](?:[^"']*\s)?slide(?:\s[^"']*)?["']/g) : null;
    return matches ? matches.length : 0;
  }, [generatedData]);

  // Calcular quantidade de slides no HTML do exemplo
  const exampleSlideCount = useMemo(() => {
    const matches = mockHtml.match(/class=["'](?:[^"']*\s)?slide(?:\s[^"']*)?["']/g);
    return matches ? matches.length : 0;
  }, [mockHtml]);

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
      <aside className="dashboard-sidebar" style={{ width: `${sidebarWidth}px` }}>
        <div className="brand-header">
          <div className="brand-logo">✨</div>
          <div>
            <h1 className="brand-title">Posts AI</h1>
            <p className="brand-subtitle">Gerador de Carrosséis</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="dashboard-form">
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="theme" className="form-label">
                Qual é o Tema ou Roteiro do Post?
              </label>
              <button
                type="button"
                className="copy-input-btn"
                onClick={() => copy(theme, "theme")}
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
                onClick={() => copy(styleGuide, "style")}
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
      <div
        className={`sidebar-resizer ${isResizing ? "is-resizing" : ""}`}
        onMouseDown={startResizing}
      />

      {/* Área Principal de Exibição / Abas */}
      <main className="dashboard-main">
        {loading || exporting ? (
          <div className="status-container">
            <div className="status-card">
              <div className="spinner"></div>
              <p className="status-headline">{loading ? "Gerando Carrossel com IA" : "Exportando Criativos"}</p>
              <p className="status-subtext">{statusText}</p>
              {loading && (
                <div className="loading-notice">
                  ⚠️ <strong>Nota importante:</strong> A geração pode levar de 30 segundos a até 3 minutos dependendo da fila de processamento. Por favor, mantenha esta página aberta.
                </div>
              )}
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
        ) : (
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
                  className={`tab-link ${activeTab === "caption" ? "active" : ""} ${!generatedData ? "disabled" : ""}`}
                  onClick={() => generatedData && setActiveTab("caption")}
                  disabled={!generatedData}
                  title={!generatedData ? "Gere um post primeiro" : undefined}
                >
                  <FileText size={16} />
                  <span>Legenda</span>
                </button>
                <button
                  className={`tab-link ${activeTab === "code" ? "active" : ""} ${!generatedData ? "disabled" : ""}`}
                  onClick={() => generatedData && setActiveTab("code")}
                  disabled={!generatedData}
                  title={!generatedData ? "Gere um post primeiro" : undefined}
                >
                  <Code size={16} />
                  <span>Código HTML</span>
                </button>
                <button
                  className={`tab-link ${activeTab === "exemplo" ? "active" : ""}`}
                  onClick={() => setActiveTab("exemplo")}
                >
                  <Sparkles size={16} />
                  <span>Exemplo</span>
                </button>
              </div>

              {generatedData && activeTab !== "exemplo" && (
                <button onClick={handleExport} className="export-btn">
                  <Download size={16} />
                  <span>Exportar ZIP (PNGs)</span>
                </button>
              )}
            </div>

            {/* Conteúdo Ativo por Aba */}
            <div className="content-body">
              {activeTab === "exemplo" && (
                <div className="preview-tab-content">
                  <div className="preview-display">
                    <IframePreview
                      html={mockHtml}
                      activeSlideIndex={activeExampleSlide}
                      format={format}
                    />
                  </div>

                  {/* Controles de Navegação do Exemplo */}
                  {exampleSlideCount > 0 && (
                    <div className="preview-controls">
                      <button
                        onClick={() => setActiveExampleSlide((prev) => Math.max(0, prev - 1))}
                        disabled={activeExampleSlide === 0}
                        className="control-nav-btn"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="slide-indicator">
                        Slide {activeExampleSlide + 1} de {exampleSlideCount}
                      </span>
                      <button
                        onClick={() => setActiveExampleSlide((prev) => Math.min(exampleSlideCount - 1, prev + 1))}
                        disabled={activeExampleSlide === exampleSlideCount - 1}
                        className="control-nav-btn"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab !== "exemplo" && !generatedData && (
                <div className="empty-container">
                  <div className="empty-placeholder">
                    <div className="placeholder-icon">🎨</div>
                    <h2 className="placeholder-title">Nenhum Post Gerado Ainda</h2>
                    <p className="placeholder-subtitle">
                      Digite um tema na barra lateral e clique em <strong>Gerar Posts</strong> para criar seus slides e legenda com Inteligência Artificial.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "preview" && generatedData && (
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

              {activeTab === "caption" && generatedData && (
                <div className="caption-tab-content">
                  <div className="tab-actions">
                    <button
                      onClick={() => copy(generatedData.caption, "caption")}
                      className="action-copy-btn"
                    >
                      {copiedCaption ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedCaption ? "Copiado!" : "Copiar Legenda"}</span>
                    </button>
                  </div>
                  <pre className="caption-display">{generatedData.caption}</pre>
                </div>
              )}

              {activeTab === "code" && generatedData && (
                <div className="code-tab-content">
                  <div className="tab-actions">
                    <button
                      onClick={() => copy(generatedData.html, "code")}
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
        )}
      </main>
    </div>
  );
}
