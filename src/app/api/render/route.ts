import { NextResponse } from "next/server";
import { chromium, Browser } from "playwright";
import JSZip from "jszip";
import { RenderRequest } from "@/types";
import { SLIDE_DIMENSIONS, TIMEOUTS, PAYLOAD_LIMITS } from "@/constants";

export async function POST(request: Request): Promise<Response> {
  let browser: Browser | null = null;
  let body: RenderRequest;

  // 1. Validar se o body é um JSON válido e possui tamanho aceitável (< 500KB)
  let requestText: string;
  try {
    requestText = await request.text();
  } catch {
    return NextResponse.json(
      { success: false, error: "Falha ao ler o corpo da requisição." },
      { status: 400 }
    );
  }

  if (requestText.length > PAYLOAD_LIMITS.maxRenderSize) { // 500KB
    return NextResponse.json(
      { success: false, error: "Payload muito grande. O limite máximo é de 500KB." },
      { status: 413 }
    );
  }

  try {
    body = JSON.parse(requestText) as RenderRequest;
  } catch {
    return NextResponse.json(
      { success: false, error: "Requisição inválida. O corpo do request deve estar no formato JSON." },
      { status: 400 }
    );
  }

  const { html, caption, format } = body;

  // 2. Validar campos obrigatórios
  if (!html || typeof html !== "string" || html.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "O campo 'html' é obrigatório e deve ser uma string HTML válida." },
      { status: 400 }
    );
  }

  if (typeof caption !== "string") {
    return NextResponse.json(
      { success: false, error: "O campo 'caption' é obrigatório e deve ser uma string de legenda." },
      { status: 400 }
    );
  }

  if (format !== "feed" && format !== "stories") {
    return NextResponse.json(
      { success: false, error: "O campo 'format' é obrigatório e deve ser 'feed' ou 'stories'." },
      { status: 400 }
    );
  }

  // 3. Definir dimensões da viewport
  const width = SLIDE_DIMENSIONS.width;
  const height = format === "feed" ? SLIDE_DIMENSIONS.feedHeight : SLIDE_DIMENSIONS.storiesHeight;

  try {
    // 4. Inicializar navegador com flags de segurança (sandbox e file-access desabilitados)
    browser = await chromium.launch({
      headless: true,
      args: [
        "--disable-gpu",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-local-file-access",
      ],
    });
    
    // Criar um contexto de navegação isolado
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width, height });

    // Interceptar requisições de rede para mitigar SSRF e vazamento de arquivos locais
    await page.route("**/*", (route) => {
      const url = route.request().url();
      
      // Permitir carregar a página inicial vazia (setContent carrega about:blank)
      if (url === "about:blank") {
        route.continue();
        return;
      }

      try {
        const parsedUrl = new URL(url);

        // Permitir estritamente apenas protocolos web http e https
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          console.warn(`[Security Alert] Requisição bloqueada devido a protocolo inválido: ${url}`);
          route.abort("blockedbyclient");
          return;
        }

        const hostname = parsedUrl.hostname.toLowerCase();

        // Bloquear endereços locais/loopback
        const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
        
        // Bloquear intervalos de IPs privados (RFC 1918)
        const isInternalIP =
          hostname.startsWith("10.") ||
          hostname.startsWith("192.168.") ||
          (hostname.startsWith("172.") &&
            (() => {
              const parts = hostname.split(".");
              const secondOctet = parseInt(parts[1] || "0", 10);
              return secondOctet >= 16 && secondOctet <= 31;
            })());

        // Bloquear endpoints de metadados da AWS/GCP/Azure
        const isCloudMetadata = hostname === "169.254.169.254";

        if (isLocalhost || isInternalIP || isCloudMetadata) {
          console.warn(`[Security Alert] Bloqueada tentativa de requisição local/interna (SSRF): ${hostname}`);
          route.abort("addressunreachable");
          return;
        }

        // Permitir requisições externas legítimas (ex: Google Fonts)
        route.continue();
      } catch (err) {
        console.error(`[Security Error] Erro ao validar requisição no interceptor de rede: ${url}`, err);
        route.abort("failed");
      }
    });

    // 5. Carregar conteúdo e aguardar rede/fontes
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // 6. Encontrar os slides
    const slides = await page.$$(".slide");
    if (slides.length === 0) {
      throw new Error("Nenhum slide (elemento com a classe '.slide') foi encontrado no HTML fornecido.");
    }

    // 7. Renderizar screenshots de cada slide
    const zip = new JSZip();
    for (let i = 0; i < slides.length; i++) {
      // Ocultar todos os slides e posicionar o atual no topo (0,0) ocupando toda a viewport
      await page.evaluate((index) => {
        // Remover margens/paddings do html/body que possam causar desalinhamento
        const html = document.documentElement;
        const body = document.body;
        html.style.margin = "0";
        html.style.padding = "0";
        html.style.overflow = "hidden";
        body.style.margin = "0";
        body.style.padding = "0";
        body.style.overflow = "hidden";

        const allSlides = document.querySelectorAll(".slide");
        allSlides.forEach((s, idx) => {
          const el = s as HTMLElement;
          if (idx === index) {
            el.style.display = "flex";
            el.style.position = "absolute";
            el.style.top = "0";
            el.style.left = "0";
            el.style.margin = "0";
          } else {
            el.style.display = "none";
          }
        });
      }, i);

      // Pequena pausa para garantir renderização do layout e fontes
      await page.waitForTimeout(TIMEOUTS.pageWaitMs);

      // Capturar a viewport inteira (que está dimensionada exatamente para o slide)
      const screenshotBuffer = await page.screenshot({ type: "png" });
      zip.file(`slide-${i + 1}.png`, screenshotBuffer);
    }

    // 8. Adicionar legenda ao ZIP
    zip.file("legenda.md", caption);

    // 9. Compactar e gerar ZIP
    const zipBuffer = await zip.generateAsync({ type: "uint8array" });

    // 10. Retornar resposta binária do ZIP para download
    return new Response(Buffer.from(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="carrossel-${format}.zip"`,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Erro na renderização dos slides via Playwright:", error);
    return NextResponse.json(
      { success: false, error: `Falha na renderização: ${errorMessage}` },
      { status: 500 }
    );
  } finally {
    // 11. Garantir que o browser sempre fecha
    if (browser) {
      await browser.close();
    }
  }
}
