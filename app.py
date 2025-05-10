from flask import Flask, request, jsonify, send_from_directory
import os
import sqlite3
from datetime import datetime
from crypto import encrypt_text, decrypt_text

app = Flask(__name__, static_folder='.')
app.config['JSON_AS_ASCII'] = False

DB_FILE = 'data.db'

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not os.path.exists(DB_FILE):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

init_db()

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
        data_str = str(item)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO items (data) VALUES (?)', (data_str,))
        conn.commit()
        inserted_id = cursor.lastrowid
        conn.close()
        
        return jsonify({"success": True, "id": inserted_id})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/saved', methods=['GET'])
def api_get_saved():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id, data, created_at FROM items ORDER BY created_at DESC')
        rows = cursor.fetchall()
        conn.close()
        
        items = []
        for row in rows:
            # Convert string representation back to dict if possible
            try:
                import ast
                item_dict = ast.literal_eval(row['data'])
            except:
                item_dict = {"data": row['data']}
            item_dict['id'] = row['id']
            item_dict['created_at'] = row['created_at']
            items.append(item_dict)
        
        return jsonify({"success": True, "items": items})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/delete/<int:item_id>', methods=['DELETE'])
def api_delete(item_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM items WHERE id = ?', (item_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
