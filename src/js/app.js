// app.js

document.addEventListener('DOMContentLoaded', () => {
    const fileUploader = document.getElementById('file-uploader');
    const bookReader = document.getElementById('book-reader');

    fileUploader.addEventListener('change', handleFileUpload);

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type;
            if (isValidFileType(fileType)) {
                // Call the function to read the file
                readBook(file);
            } else {
                alert('Por favor, carregue um arquivo EPUB, MOBI ou PDF.');
            }
        }
    }

    function isValidFileType(fileType) {
        return fileType === 'application/epub+zip' || 
               fileType === 'application/x-mobipocket' || 
               fileType === 'application/pdf';
    }

    function readBook(file) {
        // Placeholder for reading the book
        // This function will interact with bookReader.js
        console.log(`Lendo o arquivo: ${file.name}`);
    }
});