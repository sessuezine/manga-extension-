# Manga OCR Extension

**A browser extension designed to extract and translate text from manga images, seamlessly integrating with the [OCR Server](https://github.com/sessuezine/ocr-server).**

## 🚀 Overview

This extension enables users to select manga images on a webpage, send them to the locally hosted OCR Server for text extraction, and display the recognized text for translation or further processing. It's an essential tool for manga enthusiasts and translators seeking to understand and interpret manga content.

## 🛠 Features

- **Image Selection** – Right-click on any manga image to send it to the OCR Server.
- **Text Extraction** – Utilizes the OCR Server’s capabilities to extract text from selected images.
- **Translation Support** – Easily copy the extracted text for translation purposes.
- **Seamless Integration** – Designed to work in tandem with the [OCR Server](https://github.com/sessuezine/ocr-server) for efficient text recognition.

## ⚡ Installation

### Prerequisites

- **OCR Server** – Ensure you have the [OCR Server](https://github.com/sessuezine/ocr-server) set up and running locally. Follow the installation instructions in its repository.

### Steps

1. **Clone the Repository**: Run `git clone https://github.com/sessuezine/manga-extension-.git` and then `cd manga-extension-`.

2. **Load the Extension into Your Browser**:

   - **Google Chrome**: Open `chrome://extensions/` in your browser, enable **Developer mode**, click **"Load unpacked"**, and select the cloned `manga-extension-` directory.
   - **Mozilla Firefox**: Open `about:debugging#/runtime/this-firefox` in your browser, click **"Load Temporary Add-on..."**, and select the `manifest.json` file inside the `manga-extension-` directory.

## 📡 Usage

1. Right-click on any manga image and select **"Extract Text with Manga OCR"**.
2. The extension sends the image to your locally running OCR Server (usually at `http://127.0.0.1:5000/`).
3. The recognized text is displayed, ready to be copied and translated.

## 🛠 Debugging

- Ensure the **OCR Server** is running at `http://127.0.0.1:5000/`.
- Check the browser console for any errors (`Ctrl + Shift + J` in Chrome, `Ctrl + Shift + K` in Firefox).
- Reload the extension from your browser's extension settings if necessary.

## 📂 File Structure

manga-extension-/
├─ background.js         (Handles communication with OCR server)
├─ content.js            (Runs on web pages to detect images)
├─ manifest.json         (Chrome/Firefox extension manifest)
├─ popup.html            (UI for interacting with extracted text)
├─ popup.js              (Logic for displaying OCR results)
└─ README.md             (Documentation)

## 📦 Dependencies

- **React** – UI framework for extension popups (optional, depending on your implementation).
- **Flask** – OCR Server backend for processing images.
- **EasyOCR** – OCR engine used for text extraction.
- **Tesseract (Future Integration)** – Optional alternative OCR engine.

## 🔮 Future Enhancements

- **Tesseract OCR Integration** – Provide an option to choose between EasyOCR and Tesseract for text extraction (Depending on use care).
- **Auto-Translation** – Directly translate extracted text into English.
- **User Preferences** – Allow users to select OCR settings.
- **Clipboard Shortcut** – Automatically copy extracted text.
