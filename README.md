# Eidocrypt
Encryption and Decryption app

Eidocrypt 🔐

Eidocrypt is a lightweight, cross-platform encryption and decryption tool built using Electron.js for the desktop and integrated into a Ghost.io website for seamless web-based decryption. Leveraging AES-128 ECB encryption with PKCS#7 padding, Eidocrypt offers a simple yet robust method for securing and decoding messages.

This project demonstrates both desktop application development and web integration for encrypted communication workflows, providing an engaging way to deliver encrypted content (e.g., in newsletters) and allowing users to decrypt messages directly via a web interface.

🌐 Live Demo

Desktop Application: Download Eidocrypt

Web Decryption Tool: Eidocrypt Web Interface

🎓 Features

AES-128 Encryption: Utilizes AES (Advanced Encryption Standard) with ECB mode and PKCS#7 padding.

Cross-Platform Desktop App: Built with Electron.js for Windows, macOS, and Linux.

Web Integration: Decryption tool embedded into Ghost.io for easy access via web browsers.

Minimalist UI: Terminal-inspired design with a clean, intuitive interface.

Real-Time Interaction: Immediate encryption/decryption with error handling for invalid inputs.

📁 Project Structure

/ eidocrypt
  |-- main.js            # Electron main process for desktop app
  |-- index.html         # Frontend interface for desktop app
  |-- renderer.js        # Frontend logic (encryption/decryption)
  |-- package.json       # Node project configuration
  |-- node_modules/      # Installed dependencies
  |-- web_integration/   # Ghost.io HTML, CSS, and JavaScript for web decryption

💡 How It Works

Encryption Algorithm

AES-128 ECB Mode: Advanced Encryption Standard using a 128-bit key.

PKCS#7 Padding: Ensures that plaintext fits perfectly into the encryption blocks.

Base64 Encoding: Encrypted messages are outputted in Base64 format for easy sharing.

Workflow

Encrypt a message on the Eidocrypt desktop app.

Distribute the encrypted message (e.g., via a newsletter).

Recipients visit the Ghost.io web interface and paste the encrypted message to decrypt it.

🔧 Installation

1. Clone the Repository

git clone https://github.com/yourusername/eidocrypt.git
cd eidocrypt

2. Install Dependencies

npm install

3. Run the Desktop App

npm start

🔄 Building the Desktop App

To package the app for distribution:

npm install electron-packager --save-dev
npx electron-packager . EidocryptApp \
  --platform=darwin \
  --arch=x64 \
  --overwrite \
  --prune=true \
  --asar

This will generate the packaged app inside the EidocryptApp-darwin-x64/ directory (for macOS). Adjust --platform and --arch for Windows or Linux.

📄 Code Overview

1. Electron Main Process (main.js)

Initializes the desktop application window.

const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

2. User Interface (index.html)

Simple terminal-inspired UI.

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eidocrypt Encryption Tool</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h2>Eidocrypt</h2>
    <textarea id="inputMessage" placeholder="Enter your message here"></textarea>
    <button id="encryptButton">Encrypt</button>
    <button id="decryptButton">Decrypt</button>
    <div id="output"></div>
    <script src="renderer.js"></script>
</body>
</html>

3. Encryption/Decryption Logic (renderer.js)

Implements AES encryption and decryption.

const CryptoJS = require('crypto-js');

const secretKey = CryptoJS.enc.Utf8.parse('ThisIsASecretKey');
const options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };

function encryptMessage(plainText) {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), secretKey, options);
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

function decryptMessage(encryptedText) {
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(encryptedText) },
        secretKey,
        options
    );
    const originalText = decrypted.toString(CryptoJS.enc.Utf8);
    return originalText || 'Error: Invalid encrypted message or key.';
}

document.getElementById('encryptButton').addEventListener('click', () => {
    const message = document.getElementById('inputMessage').value.trim();
    document.getElementById('output').innerText = encryptMessage(message);
});

document.getElementById('decryptButton').addEventListener('click', () => {
    const encryptedMessage = document.getElementById('inputMessage').value.trim();
    document.getElementById('output').innerText = decryptMessage(encryptedMessage);
});

🌐 Web Integration (Ghost.io)

1. HTML for Ghost.io

Embed this in the Ghost.io Header Code Injection:

<div class="eidocrypt-container">
    <h2>Eidocrypt Decryption</h2>
    <input type="text" id="inputMessage" placeholder="Enter your encrypted code here">
    <button id="decryptButton">Decrypt</button>
    <div id="outputBox"></div>
</div>

2. CSS Styling

<style>
    .eidocrypt-container {
        font-family: 'Courier New', monospace;
        background: rgba(0, 0, 0, 0.9);
        padding: 20px;
        border-radius: 10px;
        color: #00ff00;
        text-align: center;
        width: 80%;
        margin: 50px auto;
    }
    .eidocrypt-container input, .eidocrypt-container button, #outputBox {
        padding: 10px;
        margin: 10px 0;
        border: 1px solid #00ff00;
        background: black;
        color: #00ff00;
        border-radius: 5px;
        width: 80%;
    }
    .eidocrypt-container button {
        background-color: #00aa00;
        cursor: pointer;
    }
    .eidocrypt-container button:hover {
        background-color: #007700;
    }
</style>

3. JavaScript for Decryption

Embed this in the Ghost.io Footer Code Injection:

<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
<script>
    const secretKey = CryptoJS.enc.Utf8.parse('ThisIsASecretKey');
    const options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };

    function decryptMessage(encryptedText) {
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(encryptedText) },
            secretKey,
            options
        );
        return decrypted.toString(CryptoJS.enc.Utf8) || 'Error: Invalid encrypted message or key.';
    }

    document.getElementById('decryptButton').addEventListener('click', () => {
        const inputMessage = document.getElementById('inputMessage').value.trim();
        const decryptedOutput = decryptMessage(inputMessage);
        document.getElementById('outputBox').innerText = decryptedOutput;
    });
</script>

🚀 Future Improvements

Cross-Platform Packaging: Create builds for Windows and Linux.

Add Encryption Options: Let users select different encryption algorithms or keys.

Password Protection: Introduce password-based encryption for added security.

Web Hosting: Convert the app to a Progressive Web App (PWA) for full web functionality.




