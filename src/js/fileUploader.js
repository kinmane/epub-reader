function validateFileType(file) {
    const validTypes = ['application/epub+zip', 'application/x-mobipocket-ebook', 'application/pdf'];
    return validTypes.includes(file.type);
}

function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length === 0) {
        alert('Por favor, selecione um arquivo para fazer upload.');
        return;
    }

    const file = files[0];
    if (!validateFileType(file)) {
        alert('Tipo de arquivo inválido. Por favor, faça upload de um arquivo EPUB, MOBI ou PDF.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = e.target.result;
        // Aqui você pode chamar uma função para processar o conteúdo do arquivo
        console.log('Arquivo carregado com sucesso:', file.name);
    };

    reader.onerror = function() {
        alert('Ocorreu um erro ao ler o arquivo. Tente novamente.');
    };

    reader.readAsArrayBuffer(file);
}

document.getElementById('file-input').addEventListener('change', handleFileUpload);