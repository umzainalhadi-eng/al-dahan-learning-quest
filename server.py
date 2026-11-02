#!/usr/bin/env python3
"""
Simple HTTP Server for Riyadh Al-Lugha Al-Arabiyya Platform
Run with: python3 server.py
Then open http://localhost:8000 in your browser.
"""

import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    # Enable address reuse so it never blocks on restarts
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 60)
        print("🌿 منصة رياض اللغة العربية - إشراف المعلم أ. علي دحان")
        print(f"📡 السيرفر يعمل الآن على الرابط: http://localhost:{PORT}")
        print("اضغط Ctrl+C لإيقاف السيرفر")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nتم إيقاف السيرفر بنجاح.")
