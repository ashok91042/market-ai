from flask import Flask, request, jsonify, send_from_directory
from typing import Dict, Any
import logging
import json
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.ai import generate_insights

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("marketmindgen")

# Get the project root directory
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(PROJECT_ROOT, 'frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')

# Manual API Key Configuration
API_KEY = "AIzaSyB8o65qDz-8kuWEMPhB5fjRGzJGo4c9NNY"
VALID_KEYS = {
    "AIzaSyB8o65qDz-8kuWEMPhB5fjRGzJGo4c9NNY": "admin",
    "demo-key-67890": "demo"
}

# Middleware to check API key
@app.before_request
def check_api_key():
    # Skip key check for static files and health endpoint
    if request.path == '/api/health' or request.path == '/' or request.path.startswith('/') and not request.path.startswith('/api/'):
        return
    
    # Only check API key for API endpoints
    if request.path.startswith('/api/'):
        api_key = request.headers.get('X-API-Key')
        if not api_key or api_key not in VALID_KEYS:
            return jsonify({"error": "Invalid or missing API key"}), 401


# Enable CORS manually
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, X-API-Key'
    return response


# Serve static files (frontend)
@app.route('/')
def serve_index():
    return send_from_directory(FRONTEND_DIR, 'index.html')


@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(FRONTEND_DIR, filename)


def parse_leads(data):
    """Parse leads from request"""
    if isinstance(data, list):
        return data
    elif isinstance(data, dict) and 'leads' in data:
        leads = data['leads']
        return [lead if isinstance(lead, dict) else lead for lead in leads]
    return []


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200


@app.route('/api/analyze', methods=['POST', 'OPTIONS'])
def analyze():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        leads = parse_leads(data.get('leads', []))
        task = data.get('task', 'insights')
        params = data.get('params')
        
        insights = generate_insights(leads, task=task, params=params)
        return jsonify({"insights": insights}), 200
    except Exception as e:
        logger.exception("analyze failed")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║          🚀 MarketAI Suite Running                          ║
    ╠════════════════════════════════════════════════════════════╣
    ║ Server:  http://localhost:8000                             ║
    ║ API Key: AIzaSyB8o65qDz-8kuWEMPhB5fjRGzJGo4c9NNY           ║
    ╚════════════════════════════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=8000, debug=True)