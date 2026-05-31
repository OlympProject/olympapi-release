import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import app from './app';

const HTTP_PORT = parseInt(process.env.PORT ?? '3000', 10);
const HTTPS_PORT = parseInt(process.env.HTTPS_PORT ?? '3443', 10);

http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`[API] HTTP  → http://localhost:${HTTP_PORT}`);
  console.log(`[API] Docs  → http://localhost:${HTTP_PORT}/api-docs`);
  console.log(`[API] Spec  → http://localhost:${HTTP_PORT}/swagger.json`);
});

const certDir = path.join(__dirname, 'certs');
const keyPath = path.join(certDir, 'server.key');
const crtPath = path.join(certDir, 'server.crt');

if (fs.existsSync(keyPath) && fs.existsSync(crtPath)) {
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(crtPath),
  };
  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`[API] HTTPS → https://localhost:${HTTPS_PORT}`);
  });
} else {
  console.warn('[API] HTTPS skipped — certs not found. Run: npm run gen-certs');
}
