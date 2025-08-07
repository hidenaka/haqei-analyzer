#!/usr/bin/env python3
import http.server
import socketserver
import os
import signal
import sys

PORT = 8899
Handler = http.server.SimpleHTTPRequestHandler

def signal_handler(sig, frame):
    print('\nサーバーを停止します...')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

# publicディレクトリに移動
os.chdir('public')

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🚀 サーバー起動中: http://localhost:{PORT}/")
    print("Ctrl+Cで停止")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nサーバーを停止しました')