from http.server import BaseHTTPRequestHandler
import requests
import json
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query_params = parse_qs(urlparse(self.path).query)
        set_id = query_params.get("set", [""])[0].strip()
        
        if not set_id:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'{"error": "Set ID obrigatorio"}')
            return

        # Endpoint oficial da documentação: /v1/cards?set_id=XXX
        api_url = f"https://api.pokemonpricetracker.com/v1/cards"
        params = {
            "set_id": set_id,
            "limit": 250  # Traz o set inteiro de uma vez
        }
        
        try:
            # Esta API é otimizada para velocidade
            response = requests.get(api_url, params=params, timeout=10)
            data = response.json()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            # Cache de 1 hora para performance máxima
            self.send_header('Cache-Control', 's-maxage=3600')
            self.end_headers()

            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))