// fileUploader.js - Validação e utilitários para upload de arquivos

const FileUploader = {
  validTypes: {
    epub: ["application/epub+zip", "application/epub"],
    pdf: ["application/pdf"],
  },

  maxFileSize: 100 * 1024 * 1024, // 100MB

  validateFileType(file) {
    const fileName = file.name.toLowerCase();

    // Verificar extensão
    if (fileName.endsWith(".epub")) {
      return "epub";
    } else if (fileName.endsWith(".pdf")) {
      return "pdf";
    }

    // Verificar MIME type
    for (const [type, mimes] of Object.entries(this.validTypes)) {
      if (mimes.includes(file.type)) {
        return type;
      }
    }

    return null;
  },

  validateFileSize(file) {
    return file.size <= this.maxFileSize;
  },

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  },

  getFileInfo(file) {
    return {
      name: file.name,
      size: this.formatFileSize(file.size),
      type: this.validateFileType(file),
      lastModified: new Date(file.lastModified).toLocaleDateString("pt-BR"),
    };
  },

  validateFile(file) {
    const errors = [];

    if (!file) {
      errors.push("Nenhum arquivo selecionado");
      return { valid: false, errors };
    }

    const fileType = this.validateFileType(file);
    if (!fileType) {
      errors.push("Formato de arquivo não suportado. Use EPUB ou PDF.");
    }

    if (!this.validateFileSize(file)) {
      errors.push(
        `Arquivo muito grande. Tamanho máximo: ${this.formatFileSize(
          this.maxFileSize
        )}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      fileType,
    };
  },
};

// Tornar disponível globalmente
window.FileUploader = FileUploader;
