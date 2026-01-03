from http.server import BaseHTTPRequestHandler
import requests
import json
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Captura o parâmetro 'set' da URL (ex: /api/pokemon?set=sv8a)
        query_params = parse_qs(urlparse(self.path).query)
        set_id = query_params.get("set", [""])[0]
        
        # Sua chave da API
        api_key = "d18f5a1e-b4db-49ad-841b-6809c5f0515c" 

        if not set_id:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'{"error": "Set ID faltando"}')
            return

        # Sintaxe oficial: q=set.id:ID_DO_SET
        # Select: pegamos apenas o essencial para ser ultra-rápido
        api_url = f"https://api.pokemontcg.io/v2/cards?q=set.id:{set_id}&select=id,name,number,images&orderBy=number"
        headers = {"X-Api-Key": api_key}

        try:
            response = requests.get(api_url, headers=headers)
            data = response.json()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            # Permite que seu index.html acesse os dados
            self.send_header('Access-Control-Allow-Origin', '*')
            # Cache de 1 hora para evitar lentidão em buscas repetidas
            self.send_header('Cache-Control', 's-maxage=3600')
            self.end_headers()

            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))