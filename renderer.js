const CryptoJS = require('crypto-js');

// AES-128 ECB Setup
const secretKey = CryptoJS.enc.Utf8.parse('ThisIsASecretKey');  // Same key used for both encryption and decryption
const options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };

// Encrypt Function
function encryptMessage(plainText) {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), secretKey, options);
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);  // Convert to Base64
}

// Decrypt Function
function decryptMessage(encryptedText) {
    try {
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(encryptedText) },
            secretKey,
            options
        );
        const originalText = decrypted.toString(CryptoJS.enc.Utf8);
        if (!originalText) {
            return 'Error: Invalid encrypted message or key.';
        }
        return originalText;
    } catch (error) {
        return 'Error: Decryption failed.';
    }
}

// Event Listener for Encrypt Button
document.getElementById('encryptButton').addEventListener('click', () => {
    const message = document.getElementById('inputMessage').value.trim();
    if (!message) {
        document.getElementById('output').innerText = 'Please enter a message to encrypt.';
        return;
    }
    const encryptedMessage = encryptMessage(message);
    document.getElementById('output').innerText = encryptedMessage;
});

// Event Listener for Decrypt Button
document.getElementById('decryptButton').addEventListener('click', () => {
    const encryptedMessage = document.getElementById('inputMessage').value.trim();
    if (!encryptedMessage) {
        document.getElementById('output').innerText = 'Please enter an encrypted message to decrypt.';
        return;
    }
    const decryptedMessage = decryptMessage(encryptedMessage);
    document.getElementById('output').innerText = decryptedMessage;
});
