const CryptoJS = require('crypto-js');

// Custom error classes for better error handling
class EncryptionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EncryptionError';
    }
}

class DecryptionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DecryptionError';
    }
}

/**
* Encrypts text using AES encryption
* @param {string} text - The text to encrypt
* @param {string} secretKey - The secret key for encryption
* @returns {string} The encrypted text in base64 format
* @throws {EncryptionError} If encryption fails
*/
function encrypt(text, secretKey) {
    try {
        if (!text || !secretKey) {
            throw new EncryptionError('Text and secret key are required');
        }
        
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
        
        // Encrypt the text using AES
        const ciphertext = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, options);
        
        // Return the encrypted text in base64 format
        return ciphertext.ciphertext.toString(CryptoJS.enc.Base64);
    } catch (error) {
        throw new EncryptionError(`Encryption failed: ${error.message}`);
    }
}

/**
* Decrypts AES encrypted text
* @param {string} encryptedText - The encrypted text in base64 format
* @param {string} secretKey - The secret key for decryption
* @returns {string} The decrypted text
* @throws {DecryptionError} If decryption fails
*/
function decrypt(encryptedText, secretKey) {
    try {
        if (!encryptedText || !secretKey) {
            throw new DecryptionError('Encrypted text and secret key are required');
        }

        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
        
        // Decrypt the text using AES
        const bytes = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(encryptedText) }, key, options);
        
        // Convert the decrypted bytes to text
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        
        if (!originalText) {
            throw new DecryptionError('Invalid encrypted text or secret key');
        }
        
        return originalText;
    } catch (error) {
        throw new DecryptionError(`Decryption failed: ${error.message}`);
    }
}

// CLI argument handling
function printUsage() {
    console.log(`
Usage: node eidocrypt.js <command> <message>

Commands:
    encrypt <message>  Encrypt a message
    decrypt <text>     Decrypt an encrypted message

Example:
    node eidocrypt.js encrypt "Hello, World!"
    node eidocrypt.js decrypt "U2FsdGVkX1..."
`);
}

function main() {
    try {
        // Hardcoded secret key to avoid needing environment variables
        const secretKey = 'ThisIsASecretKey';

        // Get command line arguments
        const [,, command, ...messageParts] = process.argv;
        const message = messageParts.join(' ');

        if (!command || !message) {
            printUsage();
            process.exit(1);
        }

        // Process commands
        switch (command.toLowerCase()) {
            case 'encrypt':
                const encrypted = encrypt(message, secretKey);
                console.log(encrypted);
                break;
            case 'decrypt':
                const decrypted = decrypt(message, secretKey);
                console.log(decrypted);
                break;
            default:
                console.error('Invalid command. Use "encrypt" or "decrypt"');
                printUsage();
                process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Export the functions for use in other modules
module.exports = {
    encrypt,
    decrypt,
    EncryptionError,
    DecryptionError
};

// Run the CLI if this file is being executed directly
if (require.main === module) {
    main();
}
