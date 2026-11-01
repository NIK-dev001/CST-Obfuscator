/**
 * CST (Custom Safe Tunnel) Obfuscator
 * A lightweight symmetric obfuscation algorithm using transposition and noise padding.
 * Supports full Unicode (Russian, English, Japanese, Emoji, etc.)
 */
const CST = {
    // Configuration for noise generation
    config: {
        separator: '|', // Delimiter between payload and noise
        noiseLength: 5, // Length of random noise string
        charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
    },

    /**
     * Generates a random noise string based on config
     * @returns {string} Random noise
     */
    _generateNoise: function() {
        let result = '';
        const chars = this.config.charset;
        for (let i = 0; i < this.config.noiseLength; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    /**
     * Encrypts a single word using CST algorithm:
     * 1. Swap indices (0 <-> 2) and (2 <-> 5)
     * 2. Reverse the array
     * 3. Append separator and random noise
     * 
     * @param {string} word - The word to encrypt
     * @returns {string} Encrypted string with noise
     */
    _encryptWord: function(word) {
        if (!word) return "";

        // Use Array.from for proper Unicode handling (emojis, CJK chars)
        let arr = Array.from(word);
        let len = arr.length;

        // Step 1: Transposition (Swap 1st and 3rd char)
        if (len >= 3) {
            [arr[0], arr[2]] = [arr[2], arr[0]];
        }

        // Step 2: Transposition (Swap 3rd and 6th char)
        if (len >= 6) {
            [arr[2], arr[5]] = [arr[5], arr[2]];
        }

        // Step 3: Reversal
        arr.reverse();

        // Step 4: Add Noise
        const noise = this._generateNoise();
        return arr.join('') + this.config.separator + noise;
    },

    /**
     * Decrypts a single CST encrypted word
     * 
     * @param {string} codeWord - The encrypted string
     * @returns {string} Decrypted original word
     */
    _decryptWord: function(codeWord) {
        // Find separator to strip noise
        const sepIndex = codeWord.lastIndexOf(this.config.separator);
        if (sepIndex === -1) return codeWord; // Return as is if no separator found

        let core = codeWord.substring(0, sepIndex);
        let arr = Array.from(core);
        let len = arr.length;

        // Step 1: Reverse back
        arr.reverse();

        // Step 2: Reverse Transposition (Swap 3rd and 6th)
        if (len >= 6) {
            [arr[2], arr[5]] = [arr[5], arr[2]];
        }

        // Step 3: Reverse Transposition (Swap 1st and 3rd)
        if (len >= 3) {
            [arr[0], arr[2]] = [arr[2], arr[0]];
        }

        return arr.join('');
    },

    /**
     * Main Encrypt Function: Processes a full sentence
     * @param {string} text - Input text
     * @returns {string} Obfuscated text
     */
    encrypt: function(text) {
        if (!text) return "";
        // Split by spaces, encrypt each word, join back
        return text.split(' ').map(word => this._encryptWord(word)).join(' ');
    },

    /**
     * Main Decrypt Function: Restores original text
     * @param {string} text - Obfuscated text
     * @returns {string} Original text
     */
    decrypt: function(text) {
        if (!text) return "";
        return text.split(' ').map(word => this._decryptWord(word)).join(' ');
    }
};

// Export for Node.js or use as global object in Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CST;
}
