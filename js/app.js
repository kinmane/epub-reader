// app.js - Controlador principal da aplicação

// Estado global da aplicação
const AppState = {
  currentFile: null,
  currentFileType: null,
  bookReader: null,
};

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  console.log("📚 Leitor de Livros inicializado");

  // Configurar worker do PDF.js
  if (typeof pdfjsLib !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    console.log("✓ PDF.js configurado");
  }

  // Verificar se EPUBjs está disponível
  if (typeof ePub !== "undefined") {
    console.log("✓ EPUBjs carregado");
  }

  // Configurar event listeners
  setupEventListeners();
});

function setupEventListeners() {
  const uploadButton = document.getElementById("upload-button");
  const fileInput = document.getElementById("file-input");

  // Botão de upload
  uploadButton.addEventListener("click", () => {
    const file = fileInput.files[0];
    if (file) {
      handleFileSelection(file);
    } else {
      showStatus("Por favor, selecione um arquivo primeiro.", "warning");
    }
  });

  // Permitir arrastar e soltar
  const uploadSection = document.getElementById("upload-section");
  uploadSection.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadSection.style.backgroundColor = "#e8f5e9";
  });

  uploadSection.addEventListener("dragleave", () => {
    uploadSection.style.backgroundColor = "";
  });

  uploadSection.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadSection.style.backgroundColor = "";

    const file = e.dataTransfer.files[0];
    if (file) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelection(file);
    }
  });

  // Mudança direta no input de arquivo
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  });
}

function handleFileSelection(file) {
  console.log("📖 Arquivo selecionado:", file.name);

  const fileType = getFileType(file);

  if (!fileType) {
    showStatus("Formato não suportado. Use arquivos EPUB ou PDF.", "error");
    return;
  }

  AppState.currentFile = file;
  AppState.currentFileType = fileType;

  showStatus(`Carregando ${file.name}...`, "loading");

  // Delegar para o módulo bookReader
  if (typeof loadBook === "function") {
    loadBook(file, fileType);
  }
}

function getFileType(file) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".epub")) {
    return "epub";
  } else if (fileName.endsWith(".pdf")) {
    return "pdf";
  }

  return null;
}

function showStatus(message, type = "info") {
  const statusElement = document.getElementById("file-status");
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.style.color =
      type === "error"
        ? "#d32f2f"
        : type === "warning"
        ? "#f57c00"
        : type === "loading"
        ? "#1976d2"
        : "#666";
  }
}

function showReaderSection() {
  document.getElementById("reader-section").style.display = "block";
  document
    .getElementById("reader-section")
    .scrollIntoView({ behavior: "smooth" });
}

function hideReaderSection() {
  document.getElementById("reader-section").style.display = "none";
}
