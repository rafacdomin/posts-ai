import fs from "fs/promises";
import path from "path";

const testHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    :root {
      --slide-width: 1080px;
      --slide-height: 1350px;
    }
    body {
      margin: 0;
      padding: 0;
    }
    .slide {
      width: var(--slide-width);
      height: var(--slide-height);
      background: linear-gradient(135deg, #FAF7F2, #F3EFE8);
      color: #1C1917;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 64px;
      border: 2px dashed rgba(28,25,23,0.2);
      box-sizing: border-box;
    }
    h1 {
      margin: 0 0 20px 0;
      color: #C96442;
    }
  </style>
</head>
<body>
  <div class="slide">
    <h1>Slide 1</h1>
    <p>Título Principal</p>
  </div>
  <div class="slide">
    <h1>Slide 2</h1>
    <p>Conteúdo do Roteiro</p>
  </div>
  <div class="slide">
    <h1>Slide 3</h1>
    <p>Call to Action</p>
  </div>
</body>
</html>`;

async function main() {
  console.log("Iniciando teste da rota de renderização (/api/render)...");
  console.log("Enviando solicitação POST para http://localhost:3009/api/render...");

  try {
    const response = await fetch("http://localhost:3009/api/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: testHtml,
        caption: "# Legenda do Post\n\nEste é um teste de renderização.\n#ia #design",
        format: "feed"
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Falha no servidor (${response.status}): ${errText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const outputPath = path.join(process.cwd(), "test-carrossel.zip");
    await fs.writeFile(outputPath, buffer);

    console.log(`\n[OK] ZIP gerado e gravado com sucesso em: ${outputPath}`);
    console.log("Descompacte e verifique se contém slide-1.png, slide-2.png, slide-3.png e legenda.md.");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("\n[ERRO] Falha ao testar renderização:", errorMessage);
    console.log("Lembre-se de certificar que o servidor de dev (next dev) está rodando na porta 3009.");
  }
}

main();
