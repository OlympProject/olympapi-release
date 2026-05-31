import * as http from 'http';
import { EventEmitter } from 'events';
import httpProxy from 'http-proxy';

const PROXY_PORT = parseInt(process.env.PROXY_PORT ?? '3001', 10);
const PROXY_TARGET = process.env.PROXY_TARGET ?? 'http://localhost:3001';

const proxy = httpProxy.createProxyServer({ target: PROXY_TARGET });

(proxy as unknown as EventEmitter).on('error', (err: Error, _req: http.IncomingMessage, res: http.ServerResponse) => {
  console.error('[PROXY] Upstream error:', err.message);
  if (res instanceof http.ServerResponse) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bad Gateway', detail: err.message }));
  }
});

const server = http.createServer((req, res) => {
  const start = Date.now();
  const method = req.method ?? 'GET';
  const url = req.url ?? '/';

  console.log(`[PROXY] → ${method} ${url}`);

  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[PROXY] ← ${res.statusCode} (${ms}ms)`);
  });

  proxy.web(req, res);
});

server.listen(PROXY_PORT, () => {
  console.log(`[PROXY] Listening on http://localhost:${PROXY_PORT}`);
  console.log(`[PROXY] Forwarding to ${PROXY_TARGET}`);
});
