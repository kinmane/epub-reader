// bookReader.js
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const readerContainer = document.getElementById('reader-container');

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type;
            if (fileType === 'application/epub+zip' || fileType === 'application/x-mobipocket' || fileType === 'application/pdf') {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const content = e.target.result;
                    displayContent(content, fileType);
                };
                reader.readAsArrayBuffer(file);
            } else {
                alert('Por favor, carregue um arquivo EPUB, MOBI ou PDF válido.');
            }
        }
    });

    function displayContent(content, fileType) {
        // Clear previous content
        readerContainer.innerHTML = '';

        if (fileType === 'application/pdf') {
            const pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

            pdfjsLib.getDocument({data: content}).promise.then(function(pdf) {
                for (let i = 1; i <= pdf.numPages; i++) {
                    pdf.getPage(i).then(function(page) {
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        const viewport = page.getViewport({scale: 1.5});
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        readerContainer.appendChild(canvas);

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                    });
                }
            });
        } else if (fileType === 'application/epub+zip') {
            // Logic to read and display EPUB content
            // Placeholder for EPUB reading logic
            readerContainer.innerHTML = '<p>EPUB reading functionality is not implemented yet.</p>';
        } else if (fileType === 'application/x-mobipocket') {
            // Logic to read and display MOBI content
            // Placeholder for MOBI reading logic
            readerContainer.innerHTML = '<p>MOBI reading functionality is not implemented yet.</p>';
        }
    }
});