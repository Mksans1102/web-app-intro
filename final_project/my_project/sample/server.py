import json
from http.server import BaseHTTPRequestHandler, HTTPServer

todos = []

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/todos':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(todos).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/api/todos':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)
            task = data.get('task')
            if task:
                todos.append(task)
            self.send_response(200)
            self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8000), Handler)
    print('Server running at http://localhost:8000/')
    server.serve_forever()