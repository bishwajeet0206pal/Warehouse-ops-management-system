import http.server
import os
import socketserver

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


socketserver.TCPServer.allow_reuse_address = True
# Bind to loopback only so the dev server isn't exposed on the local network.
with socketserver.TCPServer(("127.0.0.1", PORT), NoCacheHTTPRequestHandler) as httpd:
    print(f"Serving {DIRECTORY} on http://127.0.0.1:{PORT} with strict NO-CACHE headers...")
    httpd.serve_forever()
