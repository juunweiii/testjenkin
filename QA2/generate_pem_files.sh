#!/bin/bash

PORT=44818
fuser -k ${PORT}/tcp

# Ensure the certs directory exists
mkdir -p certs

# Generate key.pem
openssl genrsa -out key.pem 4096

# Generate csr.pem (Certificate Signing Request)
openssl req -new -key key.pem -out csr.pem -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=common.name"

# Generate cert.pem (Self-signed Certificate)
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem