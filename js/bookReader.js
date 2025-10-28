// bookReader.js - Módulo para ler e exibir livros

let currentBook = null;
let currentRendition = null;
let currentPdfDoc = null;
let currentPdfPage = 1;

// Função principal para carregar um livro
function loadBook(file, fileType) {
  const bookContent = document.getElementById("book-content");
  bookContent.innerHTML = '<p style="text-align: center;">Carregando...</p>';

  if (fileType === "epub") {
    loadEpub(file);
  } else if (fileType === "pdf") {
    loadPdf(file);
  }
}

// Carregar arquivo EPUB
function loadEpub(file) {
  try {
    // Criar URL do arquivo para o EPUBjs
    const fileURL = URL.createObjectURL(file);

    // Criar livro usando EPUBjs com o Blob URL
    currentBook = ePub(fileURL, {
      openAs: "epub",
    });

    const bookContent = document.getElementById("book-content");
    bookContent.innerHTML = "";

    // Renderizar o livro
    currentRendition = currentBook.renderTo("book-content", {
      width: "100%",
      height: 600,
      spread: "none",
      flow: "paginated",
    });

    // Aguardar o livro carregar e então exibir
    currentBook.ready
      .then(() => {
        return currentRendition.display();
      })
      .then(() => {
        // Configurar navegação
        setupEpubNavigation();
        showReaderSection();
        showStatus("Livro EPUB carregado com sucesso!", "info");
      })
      .catch((error) => {
        console.error("Erro ao carregar EPUB:", error);
        showStatus(
          `Erro ao carregar o arquivo EPUB: ${error.message}`,
          "error"
        );
        URL.revokeObjectURL(fileURL);
      });
  } catch (error) {
    console.error("Erro ao processar EPUB:", error);
    showStatus(`Erro ao processar o arquivo EPUB: ${error.message}`, "error");
  }
}

function setupEpubNavigation() {
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const pageInfo = document.getElementById("page-info");

  pageInfo.textContent = "EPUB - Use os botões para navegar";

  nextButton.onclick = () => {
    if (currentRendition) {
      currentRendition.next();
    }
  };

  prevButton.onclick = () => {
    if (currentRendition) {
      currentRendition.prev();
    }
  };

  // Navegação por teclado
  document.addEventListener("keydown", (e) => {
    if (!currentRendition) return;

    if (e.key === "ArrowRight") {
      currentRendition.next();
    } else if (e.key === "ArrowLeft") {
      currentRendition.prev();
    }
  });
}

// Carregar arquivo PDF
function loadPdf(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const arrayBuffer = e.target.result;

    // Carregar PDF usando PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

    loadingTask.promise
      .then(function (pdf) {
        currentPdfDoc = pdf;
        currentPdfPage = 1;

        renderPdfPage(1);
        setupPdfNavigation();
        showReaderSection();
        showStatus(`PDF carregado: ${pdf.numPages} páginas`, "info");
      })
      .catch(function (error) {
        console.error("Erro ao carregar PDF:", error);
        showStatus("Erro ao carregar o arquivo PDF.", "error");
      });
  };

  reader.onerror = function () {
    showStatus("Erro ao ler o arquivo.", "error");
  };

  reader.readAsArrayBuffer(file);
}

function renderPdfPage(pageNum) {
  if (!currentPdfDoc) return;

  const bookContent = document.getElementById("book-content");
  bookContent.innerHTML =
    '<p style="text-align: center;">Renderizando página...</p>';

  currentPdfDoc.getPage(pageNum).then(function (page) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    bookContent.innerHTML = "";
    bookContent.appendChild(canvas);

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    page.render(renderContext).promise.then(function () {
      console.log(`Página ${pageNum} renderizada`);
    });
  });
}

function setupPdfNavigation() {
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const pageInfo = document.getElementById("page-info");

  function updatePageInfo() {
    pageInfo.textContent = `Página ${currentPdfPage} de ${currentPdfDoc.numPages}`;
    prevButton.disabled = currentPdfPage <= 1;
    nextButton.disabled = currentPdfPage >= currentPdfDoc.numPages;
  }

  updatePageInfo();

  nextButton.onclick = () => {
    if (currentPdfPage < currentPdfDoc.numPages) {
      currentPdfPage++;
      renderPdfPage(currentPdfPage);
      updatePageInfo();
    }
  };

  prevButton.onclick = () => {
    if (currentPdfPage > 1) {
      currentPdfPage--;
      renderPdfPage(currentPdfPage);
      updatePageInfo();
    }
  };

  // Navegação por teclado
  document.addEventListener("keydown", (e) => {
    if (!currentPdfDoc) return;

    if (e.key === "ArrowRight" && currentPdfPage < currentPdfDoc.numPages) {
      currentPdfPage++;
      renderPdfPage(currentPdfPage);
      updatePageInfo();
    } else if (e.key === "ArrowLeft" && currentPdfPage > 1) {
      currentPdfPage--;
      renderPdfPage(currentPdfPage);
      updatePageInfo();
    }
  });
}
