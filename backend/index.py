from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient, errors
from dotenv import load_dotenv
from routes.user_routes import user_bp
import os

app = Flask(__name__, static_folder='public', static_url_path='/')
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')

@app.route('/', defaults={'path': ''})

@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/health')
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    if not os.path.exists(app.static_folder):
        os.makedirs(app.static_folder)
        
    app.run(debug=True, port=5000)
