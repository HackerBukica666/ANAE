# ANAE - Text Verschlüsselung & Entschlüsselung

ANAE ist eine Webanwendung zur Verschlüsselung und Entschlüsselung von Text mit verschiedenen Methoden:

- Standardtext
- Binärcode
- Cäsar-Verschlüsselung

## Features

- Verschlüsselung und Entschlüsselung von Text
- Unterstützung für verschiedene Formate (Text, Binär, Cäsar)
- Speichern, Laden und Löschen von verschlüsselten/entschlüsselten Texten
- Download von verschlüsselten/entschlüsselten Texten als TXT-Datei
- Responsive Design für alle Geräte
- Dark Mode mit Umschaltfunktion
- Nutzung von Font Awesome Icons für UI-Elemente

## Installation und Start

### Voraussetzungen

- Python 3.6 oder höher
- Flask (Python-Framework)
- SQLite3 (ist in Python standardmäßig enthalten)
- Internetverbindung für Font Awesome Icons (CDN)

### Installation

1. Klone oder lade das Repository herunter

2. Installiere die benötigten Pakete:

```bash
pip install flask
```
! Wenn das Problem 'bash: pip: command not found' auftaucht muss man diese bash codes ausführen:
- py --version
- py -m pip --version                                       
! wenn bis jetzt jeweils kein fehler auftaucht kann man mit dem folgenden code flask installiren
- py -m pip install flask
! wenn es fehler gab konsultieren sie das internet


3. Starte die Anwendung:

```bash
python app.py
```

4. Öffne in deinem Browser die folgende URL (Standardport 5000):

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

### Speichern, Laden und Löschen

- Klicke auf "Speichern", um den aktuellen Input und Output in der Datenbank zu speichern
- Gespeicherte Texte werden in der Seitenleiste angezeigt
- Klicke auf einen gespeicherten Eintrag, um ihn zu laden
- Klicke auf "Löschen" neben einem gespeicherten Eintrag, um ihn dauerhaft zu entfernen

### Herunterladen

- Klicke auf "Herunterladen", um Input und Output als TXT-Datei herunterzuladen

### Dark Mode

- Über den Mond-/Sonnen-Button in der Navigationsleiste kann der Dark Mode ein- und ausgeschaltet werden

## Projektstruktur

```
ANAE/
├── app.py             # Flask-Anwendung (Backend)
├── crypto.py          # Verschlüsselungs-/Entschlüsselungsfunktionen
├── index.html         # Haupt-HTML-Datei
├── style.css          # CSS-Styles
├── script.js          # JavaScript-Funktionalität
├── data.db            # Gespeicherte Datenbankdatei (automatisch erstellt)
└── README.md          # Diese Datei
```

## Technologien

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript, Font Awesome Icons (CDN)
- **Datenspeicherung**: SQLite-Datenbank
