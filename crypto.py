"""
Verschlüsselungs- und Entschlüsselungsmodul für die ANAE-Anwendung
Unterstützt Text, Binär und Cäsar-Verschlüsselung
"""

def text_to_binary(text):
    """Konvertiert einen Text in Binärcode"""
    return ' '.join(format(ord(char), '08b') for char in text)

def binary_to_text(binary):
    """Konvertiert Binärcode zurück in Text"""
    try:
        # Entferne Leerzeichen und teile in 8-Bit-Blöcke
        binary = binary.replace(' ', '')
        return ''.join(chr(int(binary[i:i+8], 2)) for i in range(0, len(binary), 8))
    except Exception as e:
        raise ValueError(f"Ungültiger Binärcode: {str(e)}")

def caesar_encrypt(text, shift):
    """Verschlüsselt einen Text mit der Cäsar-Verschlüsselung"""
    result = ""
    for char in text:
        if char.isalpha():
            ascii_offset = ord('a') if char.islower() else ord('A')
            result += chr((ord(char) - ascii_offset + shift) % 26 + ascii_offset)
        else:
            result += char
    return result

def caesar_decrypt(text, shift):
    """Entschlüsselt einen mit Cäsar verschlüsselten Text"""
    return caesar_encrypt(text, 26 - (shift % 26))

def encrypt_text(text, input_type, output_type, input_shift=3, output_shift=3):
    """
    Verschlüsselt einen Text basierend auf den angegebenen Typen.
    
    Args:
        text (str): Der zu verschlüsselnde Text
        input_type (str): Der Eingabetyp ('text', 'binary', 'caesar')
        output_type (str): Der Ausgabetyp ('text', 'binary', 'caesar')
        input_shift (int): Die Verschiebung für Cäsar-Eingabe
        output_shift (int): Die Verschiebung für Cäsar-Ausgabe
        
    Returns:
        str: Der verschlüsselte Text
    """
    # Zuerst den Eingabetyp konvertieren
    intermediate_text = text
    
    # Input-Behandlung
    if input_type == 'binary':
        try:
            intermediate_text = binary_to_text(text)
        except ValueError as e:
            raise ValueError(f"Fehler bei der Binär-Dekodierung: {str(e)}")
    elif input_type == 'caesar':
        intermediate_text = caesar_decrypt(text, input_shift)
    
    # Output-Behandlung
    result = intermediate_text
    if output_type == 'binary':
        result = text_to_binary(intermediate_text)
    elif output_type == 'caesar':
        result = caesar_encrypt(intermediate_text, output_shift)
    
    return result

def decrypt_text(text, input_type, output_type, input_shift=3, output_shift=3):
    """
    Entschlüsselt einen Text basierend auf den angegebenen Typen.
    
    Args:
        text (str): Der zu entschlüsselnde Text
        input_type (str): Der Eingabetyp ('text', 'binary', 'caesar')
        output_type (str): Der Ausgabetyp ('text', 'binary', 'caesar')
        input_shift (int): Die Verschiebung für Cäsar-Eingabe
        output_shift (int): Die Verschiebung für Cäsar-Ausgabe
        
    Returns:
        str: Der entschlüsselte Text
    """
    # Bei der Entschlüsselung kehren wir die Reihenfolge um
    intermediate_text = text
    
    # Input-Behandlung
    if input_type == 'binary':
        try:
            intermediate_text = binary_to_text(text)
        except ValueError as e:
            raise ValueError(f"Fehler bei der Binär-Dekodierung: {str(e)}")
    elif input_type == 'caesar':
        intermediate_text = caesar_decrypt(text, input_shift)
    
    # Output-Behandlung
    result = intermediate_text
    if output_type == 'binary':
        result = text_to_binary(intermediate_text)
    elif output_type == 'caesar':
        result = caesar_encrypt(intermediate_text, output_shift)
    
    return result