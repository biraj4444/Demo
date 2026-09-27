#!/usr/bin/env python3
"""
Local preview server for the Expressive Send site.

This is ONLY for previewing on your own device before you deploy — it has
nothing to do with how the site runs once it's live. Cloudflare Pages does
not run this file; it just serves the plain HTML/CSS/JS files directly.

Usage (Termux or any machine with Python 3):
    python3 run.py
    python3 run.py 8080          # use a specific port

Then open the printed URL in a browser on the same device.
Press Ctrl+C to stop.
"""

import http.server
import socketserver
import sys
import os

DEFAULT_PORT = 8000


def main():
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            sys.exit("Port must be a number, e.g. python3 run.py 8080")

    # Serve from the folder this script lives in, regardless of where
    # it's launched from.
    root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root)

    handler = http.server.SimpleHTTPRequestHandler

    with socketserver.TCPServer(("", port), handler) as httpd:
        print("Serving Expressive Send at:")
        print("  http://localhost:{}".format(port))
        print("\n(This is a local preview only — Cloudflare Pages will serve")
        print("the same files directly once deployed, with no Python involved.)")
        print("\nPress Ctrl+C to stop.\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")


if __name__ == "__main__":
    main()
