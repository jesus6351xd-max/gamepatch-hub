import os
import time
import json
import http.server
import socketserver
import urllib.request
import urllib.parse

PORT = int(os.environ.get("PORT", 8000))
CACHE = {}
CACHE_TTL = 600

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/ping':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"pong")
            return

        if self.path.startswith('/api/proxy?url='):
            partes = self.path.split('url=', 1)
           target_url = urllib.parse.unquote(partes[1])
            ahora = time.time()

            if target_url in CACHE and (ahora - CACHE[target_url]['time']) < CACHE_TTL:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(CACHE[target_url]['data'])
                return

            try:
                req = urllib.request.Request(target_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as response:
                    data = response.read()
                    CACHE[target_url] = {'data': data, 'time': ahora}
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(data)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())

        elif self.path.startswith('/api/translate?text='):
            partes = self.path.split('text=', 1)
           texto = urllib.parse.unquote(partes[1])[:1500]
            try:
                dominio = ".".join(["translate", "googleapis", "com"])
                ruta = "/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=" + urllib.parse.quote(texto)
                req = urllib.request.Request("https://" + dominio + ruta, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as response:
                    raw = json.loads(response.read().decode('utf-8'))
                    traducido = "".join([bloque[0] for bloque in raw[0] if bloque[0]])
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'translated': traducido}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            super().do_GET()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), ProxyHandler) as httpd:
    print("Servidor GamePatch Pro activo en puerto", PORT)
    httpd.serve_forever()

