from http.server import BaseHTTPRequestHandler
import requests
import json
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query_params = parse_qs(urlparse(self.path).query)
        set_id = query_params.get("set", [""])[0].strip()
        
        # Se não houver set_id, evitamos o erro 500 retornando erro 400
        if not set_id:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'{"error": "Parametro set e obrigatorio"}')
            return

        # URL oficial da Documentação para listagem por Set
        api_url = f"https://api.pokemonpricetracker.com/v1/cards"
        params = {
            "set_id": set_id,
            "limit": 250
        }

        try:
            # Fazendo a requisição com Timeout para não travar a Vercel
            response = requests.get(api_url, params=params, timeout=15)
            
            # Verifica se a API retornou erro (ex: 404 ou 403)
            response.raise_for_status()
            data = response.json()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        except Exception as e:
            # Se der erro, ele envia a mensagem real para o seu console do navegador
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_msg = {"error": "Falha na API Price Tracker", "details": str(e)}
            self.wfile.write(json.dumps(error_msg).encode('utf-8'))