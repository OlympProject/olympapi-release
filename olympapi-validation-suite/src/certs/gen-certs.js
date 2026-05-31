#!/usr/bin/env node
// Cross-platform cert generator — no openssl or WSL required.
// Run: node src/certs/gen-certs.js
const { generate } = require('selfsigned');
const { writeFileSync } = require('fs');
const { join } = require('path');

const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = generate(attrs, { days: 3650, keySize: 2048, algorithm: 'sha256' });

const dir = join(__dirname);
writeFileSync(join(dir, 'server.key'), pems.private);
writeFileSync(join(dir, 'server.crt'), pems.cert);
console.log('Certs generated: src/certs/server.key + server.crt');
console.log('Restart the dev server to enable HTTPS on :3443');
