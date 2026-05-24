const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

(async () => {
  // Caminho da pasta com os arquivos markdown
  const docsPath = 'doc_visao';

  // Verifica se a pasta existe
  if (!fs.existsSync(docsPath)) {
    console.log(`A pasta "${docsPath}" não existe.`);
    return;
  }

  // Busca todos os arquivos .md da pasta
  const files = fs.readdirSync(docsPath).filter((file) => file.endsWith('.md'));

  // Verifica se existem arquivos markdown
  if (files.length === 0) {
    console.log('Nenhum arquivo .md encontrado.');
    return;
  }

  let combinedMarkdown = '';

  // Lê todos os arquivos markdown
  for (const file of files) {
    const filePath = path.join(docsPath, file);

    console.log(`Lendo: ${filePath}`);

    const content = fs.readFileSync(filePath, 'utf-8');

    // Adiciona título automático
    combinedMarkdown += `
# ${file}

${content}

---

`;
  }

  // Converte markdown para HTML
  const htmlContent = marked(combinedMarkdown);

  // Estrutura HTML completa
  const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">

    <head>

      <meta charset="UTF-8">

      <title>Documentação Completa</title>

      <style>

        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          line-height: 1.7;
          color: #222;
        }

        h1 {
          color: #111;
          border-bottom: 2px solid #ccc;
          padding-bottom: 10px;
          margin-top: 50px;
        }

        h2, h3 {
          color: #333;
        }

        p {
          text-align: justify;
        }

        pre {
          background: #f4f4f4;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
        }

        code {
          background: #f4f4f4;
          padding: 2px 4px;
          border-radius: 3px;
        }

        table {
          border-collapse: collapse;
          width: 100%;
          margin-top: 20px;
        }

        table, th, td {
          border: 1px solid #ccc;
        }

        th, td {
          padding: 10px;
          text-align: left;
        }

        img {
          max-width: 100%;
          margin-top: 20px;
        }

        hr {
          margin: 50px 0;
        }

      </style>

    </head>

    <body>

      <h1>Documentação Completa</h1>

      ${htmlContent}

    </body>

  </html>
  `;

  // Inicializa navegador
  const browser = await puppeteer.launch({
    headless: true,
  });

  // Nova página
  const page = await browser.newPage();

  // Define conteúdo HTML
  await page.setContent(html, {
    waitUntil: 'networkidle0',
  });

  // Gera PDF
  await page.pdf({
    path: 'documentacao-completa.pdf',
    format: 'A4',
    printBackground: true,

    margin: {
      top: '30px',
      bottom: '30px',
      left: '30px',
      right: '30px',
    },
  });

  // Fecha navegador
  await browser.close();

  console.log('PDF gerado com sucesso!');
  console.log('Arquivo: documentacao-completa.pdf');
})();
