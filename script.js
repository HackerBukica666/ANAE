const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const modeToggle = document.getElementById('modeToggle');
const modeIcon = document.getElementById('modeIcon');
const modeText = document.getElementById('modeText');
const languageSelect = document.getElementById('languageSelect');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const saveBtn = document.getElementById('saveBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Initialer Zustand
let isDarkMode = false;
let isEncryptMode = true; // true = verschlüsseln, false = entschlüsseln

// Theme Toggle
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    themeIcon.textContent = isDarkMode ? '🌙' : '☀️';
});

// Mode Toggle
modeToggle.addEventListener('click', () => {
    isEncryptMode = !isEncryptMode;
    modeIcon.textContent = isEncryptMode ? '🔒' : '🔓';
    modeText.textContent = isEncryptMode ? 'Verschlüsselung' : 'Entschlüsselung';
    
    // Optional: Tausche Input und Output
    const temp = inputText.value;
    inputText.value = outputText.value;
    outputText.value = temp;
    
    // Aktualisiere den Output basierend auf dem neuen Modus
    processText();
});

// Verarbeite den Text, wenn sich der Input oder die Sprache ändert
inputText.addEventListener('input', processText);
languageSelect.addEventListener('change', processText);

// Funktion zur Verarbeitung des Textes
function processText() {
    const text = inputText.value;
    const language = languageSelect.value;
    
    if (text.trim() === '') {
        outputText.value = '';
        return;
    }
    
    // Hier wird die eigentliche Verschlüsselung/Entschlüsselung implementiert
    
    let result = '';
    
    switch (language) {
        case 'caesar':
            // Einfache Caesar-Verschiebung um 3 Stellen
            const shift = 3;
            result = caesarCipher(text, isEncryptMode ? shift : -shift);
            break;
            
        case 'vigenere':
            // Einfache Vigenère mit Schlüssel "KEY"
            const key = "KEY";
            result = vigenereCipher(text, key, isEncryptMode);
            break;
            
        case 'base64':
            // Base64 Kodierung/Dekodierung
            try {
                if (isEncryptMode) {
                    result = btoa(text);
                } else {
                    result = atob(text);
                }
            } catch (e) {
                result = "Fehler: Ungültiger Base64-Input";
            }
            break;
            
        case 'morse':
            // Morse-Code Umwandlung
            result = isEncryptMode ? textToMorse(text) : morseToText(text);
            break;
            
        case 'binary':
            // Binär-Umwandlung
            result = isEncryptMode ? textToBinary(text) : binaryToText(text);
            break;
    }
    
    outputText.value = result;
}

// Implementierung der Verschlüsselungsmethoden

// Caesar-Verschlüsselung
function caesarCipher(text, shift) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            // Großbuchstaben
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
            }
            // Kleinbuchstaben
            else if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
            }
        }
        return char;
    }).join('');
}

// Vigenère-Verschlüsselung
function vigenereCipher(text, key, encrypt) {
    const result = [];
    let j = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const keyChar = key[j % key.length].toUpperCase();
            const keyCode = keyChar.charCodeAt(0) - 65;
            
            j++;
            
            // Großbuchstaben
            if (code >= 65 && code <= 90) {
                if (encrypt) {
                    result.push(String.fromCharCode(((code - 65 + keyCode) % 26) + 65));
                } else {
                    result.push(String.fromCharCode(((code - 65 - keyCode + 26) % 26) + 65));
                }
            }
            // Kleinbuchstaben
            else if (code >= 97 && code <= 122) {
                if (encrypt) {
                    result.push(String.fromCharCode(((code - 97 + keyCode) % 26) + 97));
                } else {
                    result.push(String.fromCharCode(((code - 97 - keyCode + 26) % 26) + 97));
                }
            }
        } else {
            result.push(char);
        }
    }
    
    return result.join('');
}

// Morse-Code Tabelle
const morseCodeTable = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 
    'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 
    'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 
    'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', 
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/'
};

// Umgekehrte Morse-Code Tabelle für die Dekodierung
const reverseMorseCodeTable = Object.fromEntries(
    Object.entries(morseCodeTable).map(([key, value]) => [value, key])
);

// Text zu Morse
function textToMorse(text) {
    return text.toUpperCase().split('').map(char => {
        return morseCodeTable[char] || char;
    }).join(' ');
}

// Morse zu Text
function morseToText(morse) {
    return morse.split(' ').map(code => {
        return reverseMorseCodeTable[code] || code;
    }).join('');
}

// Text zu Binär
function textToBinary(text) {
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
}

// Binär zu Text
function binaryToText(binary) {
    return binary.split(' ').map(bin => {
        return String.fromCharCode(parseInt(bin, 2));
    }).join('');
}

// Speichern-Funktion
saveBtn.addEventListener('click', () => {
    // Hier würde normalerweise eine Funktion zum Speichern in einer Datenbank sein
    // In diesem Beispiel nur eine einfache Bestätigung
    alert('Text gespeichert!');
    
    // Alternativ könnten wir den Text im localStorage speichern
    localStorage.setItem('savedText', outputText.value);
});

// Download-Funktion
downloadBtn.addEventListener('click', () => {
    const text = outputText.value;
    const filename = `anae_${languageSelect.value}_${isEncryptMode ? 'encrypted' : 'decrypted'}.txt`;
    const blob = new Blob([text], { type: 'text/plain' });
    
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});