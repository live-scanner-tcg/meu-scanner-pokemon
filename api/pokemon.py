from http.server import BaseHTTPRequestHandler
import requests
import json
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query_params = parse_qs(urlparse(self.path).query)
        set_id = query_params.get("set", [""])[0].strip()
        
        api_key = "d18f5a1e-b4db-49ad-841b-6809c5f0515c" 

        if not set_id:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'{"error": "Digite um termo de busca"}')
            return

        api_url = "https://api.pokemontcg.io/v2/cards"
        
        # MUDANÇA AQUI: Removemos o "set.id" e usamos apenas "id:TERMO*"
        # Isso busca qualquer carta que comece com o código que você digitou
        params = {
            "q": f'id:{set_id}*', 
            "select": "id,name,number,images",
            "orderBy": "number",
            "pageSize": "100"
        }
        
        headers = {"X-Api-Key": api_key}

        try:
            response = requests.get(api_url, headers=headers, params=params)
            data = response.json()

            # Se não achou nada com ID, tentamos buscar pelo NOME do set
            if data.get('totalCount') == 0:
                params["q"] = f'set.name:"{set_id}*"'
                response = requests.get(api_url, headers=headers, params=params)
                data = response.json()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))