# 📚 Leitor de Livros

Um leitor de livros simples e funcional para arquivos **EPUB** e **PDF** que funciona diretamente no navegador, sem necessidade de instalação ou servidor.

## ✨ Funcionalidades

- 📖 Leitura de arquivos EPUB
- 📄 Leitura de arquivos PDF
- ⌨️ Navegação por teclado (setas ← →)
- 📱 Interface responsiva
- 🎨 Design limpo e moderno
- 🚀 Funciona 100% no navegador (sem npm, sem servidor)

## 🚀 Como Usar

1. **Abra o arquivo `index.html` diretamente no seu navegador**

   - Clique duas vezes no arquivo `index.html`
   - Ou arraste o arquivo para o navegador
   - Ou clique com o botão direito → Abrir com → Seu navegador preferido

2. **Carregue um livro**

   - Clique em "Selecione um Arquivo"
   - Escolha um arquivo EPUB ou PDF
   - Clique em "Carregar Livro"

3. **Navegue pelo livro**
   - Use os botões "← Anterior" e "Próxima →"
   - Ou use as teclas de seta do teclado

## 📁 Estrutura do Projeto

```
epub-reader/
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos da aplicação
├── js/
│   ├── app.js         # Controlador principal
│   ├── bookReader.js  # Lógica de leitura de livros
│   └── fileUploader.js # Validação de arquivos
├── assets/
│   └── icons          # Ícones (se necessário)
└── README.md          # Este arquivo
```

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura
- **CSS3** - Estilos
- **JavaScript Vanilla** - Lógica
- **PDF.js** (via CDN) - Renderização de PDFs
- **EPUBjs** (via CDN) - Renderização de EPUBs

## 📝 Formatos Suportados

- ✅ EPUB (.epub)
- ✅ PDF (.pdf)

## ⚡ Recursos

- Sem dependências locais
- Sem necessidade de npm install
- Sem necessidade de servidor web
- Totalmente offline após o primeiro carregamento
- Leve e rápido

## 🎯 Uso Avançado

### Arrastar e Soltar

Você pode arrastar um arquivo EPUB ou PDF diretamente para a área de upload.

### Navegação por Teclado

- **Seta Direita (→)**: Próxima página
- **Seta Esquerda (←)**: Página anterior

## 🌐 Compatibilidade

Testado e funcional nos seguintes navegadores:

- Google Chrome / Chromium
- Mozilla Firefox
- Microsoft Edge
- Safari

## 📄 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

---

**Desenvolvido com ❤️ para amantes de livros digitais**
