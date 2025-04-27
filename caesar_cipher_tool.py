def caesar_shift(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            shifted = (ord(char) - base + shift) % 26 + base
            result += chr(shifted)
        else:
            result += char
    return result

def text_to_binary(text):
    return ' '.join(format(ord(c), '08b') for c in text)

def binary_to_text(binary_str):
    try:
        chars = binary_str.split()
        return ''.join(chr(int(b, 2)) for b in chars)
    except ValueError:
        print("Ungültige Binär-Eingabe.")
        return ""

def main():
    print("Wähle den Eingabetyp:")
    print("1: Klartext")
    print("2: Cäsar-Chiffre")
    print("3: Binär")
    input_type = input("Deine Wahl (1, 2 oder 3): ").strip()

    print("Wähle den Ausgabetyp:")
    output_options = {'1': 'Klartext', '2': 'Cäsar-Chiffre', '3': 'Binär'}
    
    if input_type in output_options:
        del output_options[input_type]
    for key, val in output_options.items():
        print(f"{key}: {val}")
    output_type = ''
    while output_type not in output_options:
        output_type = input(f"Deine Wahl ({', '.join(output_options.keys())}): ").strip()

    text = input("Gib den Text ein: ")

    shift = 0
    if input_type == '2' or output_type == '2':
        while True:
            try:
                shift = int(input("Gib die Verschiebung für die Cäsar-Chiffre ein (z.B. 3): "))
                break
            except ValueError:
                print("Bitte eine gültige ganze Zahl eingeben.")

    if input_type == '2':
        text = caesar_shift(text, -shift)
    elif input_type == '3':
        text = binary_to_text(text)

    if output_type == '2':
        text = caesar_shift(text, shift)
    elif output_type == '3':
        text = text_to_binary(text)

    print("Ergebnis:")
    print(text)

if __name__ == "__main__":
    main()
