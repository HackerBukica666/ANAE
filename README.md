# ANAE - Text Verschlüsselung & Entschlüsselung

ANAE ist eine Webanwendung zur Verschlüsselung und Entschlüsselung von Text mit verschiedenen Methoden:

- Standardtext
- Binärcode
- Cäsar-Verschlüsselung

## Features

- Verschlüsselung und Entschlüsselung von Text
- Unterstützung für verschiedene Formate (Text, Binär, Cäsar)
- Speichern von verschlüsselten/entschlüsselten Texten
- Download von verschlüsselten/entschlüsselten Texten als TXT-Datei
- Responsive Design für alle Geräte
- Dark Mode für angenehmes Arbeiten bei Nacht

## Installation und Start

### Voraussetzungen

- Python 3.6 oder höher
- Flask (Python-Framework)

### Installation

1. Klone oder lade das Repository herunter

2. Installiere die benötigten Pakete:

```bash
pip install flask
```

3. Starte die Anwendung:

```bash
python app.py
```

4. Öffne in deinem Browser die folgende URL:

```
http://localhost:5000
```

## Verwendung

### Verschlüsselung

1. Wähle den Eingabetyp (Text, Binär oder Cäsar)
2. Gib den Text ein, den du verschlüsseln möchtest
3. Wähle den Ausgabetyp (Text, Binär oder Cäsar)
4. Klicke auf "Verschlüsseln"
5. Das Ergebnis erscheint im Ausgabefeld

### Entschlüsselung

1. Wähle den Eingabetyp (Text, Binär oder Cäsar)
2. Gib den Text ein, den du entschlüsseln möchtest
3. Wähle den Ausgabetyp (Text, Binär oder Cäsar)
4. Klicke auf "Entschlüsseln"
5. Das Ergebnis erscheint im Ausgabefeld

### Speichern und Herunterladen

- Klicke auf "Speichern", um den aktuellen Input und Output zu speichern
- Klicke auf "Herunterladen", um Input und Output als TXT-Datei herunterzuladen
- Gespeicherte Texte können über den "Gespeichert"-Button in der Navigationsleiste angezeigt werden

## Projektstruktur

```
ANAE/
├── app.py             # Flask-Anwendung (Backend)
├── crypto.py          # Verschlüsselungs-/Entschlüsselungsfunktionen
├── index.html         # Haupt-HTML-Datei
├── styles.css         # CSS-Styles
├── script.js          # JavaScript-Funktionalität
├── data.json          # Gespeicherte Daten (automatisch erstellt)
└── README.md          # Diese Datei
```

## Technologien

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **Datenspeicherung**: JSON
