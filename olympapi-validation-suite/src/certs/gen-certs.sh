#!/bin/bash
set -e
cd "$(dirname "$0")"
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
  -keyout server.key -out server.crt \
  -subj "/CN=localhost"
echo "Certs generated: server.key + server.crt"
