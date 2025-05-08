from flask import Flask, request, jsonify, send_from_directory
import json
import os
from datetime import datetime
from crypto import encrypt_text, decrypt_text

app = Flask(__name__, static_folder='.')
app.config['JSON_AS_ASCII'] = False

# Stellen Sie sicher, dass die JSON-Datei existiert
DATA_FILE = 'data.json'
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump({"items": []}, f, ensure_ascii=False, indent=4)

# Daten aus JSON laden
def load_data():
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Fehler beim Laden der Daten: {e}")
        return {"items": []}

# Daten in JSON speichern
def save_data(data):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        return True
    except Exception as e:
        print(f"Fehler beim Speichern der Daten: {e}")
        return False

# Routen für statische Dateien
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

# API-Endpunkte
@app.route('/api/encrypt', methods=['POST'])
def api_encrypt():
    try:
        data = request.json
        input_type = data.get('input_type', 'text')
        output_type = data.get('output_type', 'text')
        text = data.get('text', '')
        input_shift = data.get('input_shift', 3)
        output_shift = data.get('output_shift', 3)
        
        result = encrypt_text(text, input_type, output_type, input_shift, output_shift)
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/decrypt', methods=['POST'])
def api_decrypt():
    try:
        data = request.json
        input_type = data.get('input_type', 'text')
        output_type = data.get('output_type', 'text')
        text = data.get('text', '')
        input_shift = data.get('input_shift', 3)
        output_shift = data.get('output_shift', 3)
        
        result = decrypt_text(text, input_type, output_type, input_shift, output_shift)
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/save', methods=['POST'])
def api_save():
    try:
        item = request.json
        
        # Daten laden
        data = load_data()
        
        # Neues Element hinzufügen (am Anfang der Liste)
        data["items"].insert(0, item)
        
        # Daten speichern
        if save_data(data):
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "message": "Fehler beim Speichern"}), 500
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/saved', methods=['GET'])
def api_get_saved():
    try:
        data = load_data()
        return jsonify({"success": True, "items": data["items"]})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)