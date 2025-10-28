// bookReader.js - Módulo para ler e exibir livros

let currentBook = null;
let currentRendition = null;
let currentPdfDoc = null;
let currentPdfPage = 1;

// Configurações de leitura
const readerSettings = {
  fontSize: 100, // porcentagem
  fontFamily: "Georgia, serif",
  theme: "light",
  lineHeight: 1.6,
};

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
        setupReaderSettings();
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

// Configurar controles de personalização
function setupReaderSettings() {
  const settingsButton = document.getElementById("settings-button");
  const settingsPanel = document.getElementById("settings-panel");
  const fontIncrease = document.getElementById("font-increase");
  const fontDecrease = document.getElementById("font-decrease");
  const fontSizeDisplay = document.getElementById("font-size-display");
  const fontFamily = document.getElementById("font-family");
  const theme = document.getElementById("theme");
  const lineHeight = document.getElementById("line-height");

  // Toggle painel de configurações
  settingsButton.onclick = () => {
    if (settingsPanel.style.display === "none") {
      settingsPanel.style.display = "block";
    } else {
      settingsPanel.style.display = "none";
    }
  };

  // Aumentar fonte
  fontIncrease.onclick = () => {
    if (readerSettings.fontSize < 200) {
      readerSettings.fontSize += 10;
      fontSizeDisplay.textContent = readerSettings.fontSize + "%";
      applySettings();
    }
  };

  // Diminuir fonte
  fontDecrease.onclick = () => {
    if (readerSettings.fontSize > 60) {
      readerSettings.fontSize -= 10;
      fontSizeDisplay.textContent = readerSettings.fontSize + "%";
      applySettings();
    }
  };

  // Mudar tipo de fonte
  fontFamily.onchange = (e) => {
    readerSettings.fontFamily = e.target.value;
    applySettings();
  };

  // Mudar tema
  theme.onchange = (e) => {
    readerSettings.theme = e.target.value;
    applySettings();
  };

  // Mudar espaçamento
  lineHeight.onchange = (e) => {
    readerSettings.lineHeight = parseFloat(e.target.value);
    applySettings();
  };

  // Restaurar valores salvos
  fontSizeDisplay.textContent = readerSettings.fontSize + "%";
}

// Aplicar configurações ao livro atual
function applySettings() {
  if (currentRendition) {
    applySettingsToEpub();
  } else if (currentPdfDoc) {
    applySettingsToPdf();
  }
}

// Aplicar configurações a EPUB
function applySettingsToEpub() {
  if (!currentRendition) return;

  const themes = {
    light: {
      body: {
        background: "#ffffff",
        color: "#000000",
      },
    },
    sepia: {
      body: {
        background: "#f4ecd8",
        color: "#5c4b37",
      },
    },
    dark: {
      body: {
        background: "#1a1a1a",
        color: "#e0e0e0",
      },
    },
  };

  // Registrar temas
  currentRendition.themes.register("light", themes.light);
  currentRendition.themes.register("sepia", themes.sepia);
  currentRendition.themes.register("dark", themes.dark);

  // Aplicar tema selecionado
  currentRendition.themes.select(readerSettings.theme);

  // Aplicar configurações de fonte
  currentRendition.themes.fontSize(readerSettings.fontSize + "%");
  currentRendition.themes.font(readerSettings.fontFamily);

  // Aplicar espaçamento
  currentRendition.themes.default({
    p: {
      "line-height": readerSettings.lineHeight + " !important",
    },
    div: {
      "line-height": readerSettings.lineHeight + " !important",
    },
  });
}

// Aplicar configurações a PDF
function applySettingsToPdf() {
  const bookContent = document.getElementById("book-content");

  const themes = {
    light: { background: "#ffffff", filter: "none" },
    sepia: { background: "#f4ecd8", filter: "sepia(30%)" },
    dark: { background: "#1a1a1a", filter: "invert(90%) hue-rotate(180deg)" },
  };

  const selectedTheme = themes[readerSettings.theme];
  bookContent.style.background = selectedTheme.background;

  const canvas = bookContent.querySelector("canvas");
  if (canvas) {
    canvas.style.filter = selectedTheme.filter;
  }
}
