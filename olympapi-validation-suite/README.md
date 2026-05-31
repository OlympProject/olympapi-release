# OlympAPI Validation Suite

A dedicated Express/TypeScript test server covering every OlympAPI feature end-to-end.

---

## Quick Start

### Docker (Recommended)

Pre-built images are published to GHCR for every OlympAPI release. Find the latest version tag on the [OlympAPI releases page](https://github.com/OlympProject/olympapi-release/releases).

#### Option A — Pull from GHCR

```bash
docker pull ghcr.io/olympproject/olympapi-validation-suite:vX.Y.Z
docker run --rm -p 3001:3001 -p 3443:3443 \
  ghcr.io/olympproject/olympapi-validation-suite:vX.Y.Z
```

Replace `vX.Y.Z` with the release tag. HTTPS with a self-signed cert is available immediately — no manual cert generation required.

#### Option B — Docker Compose (API + Proxy)

From this directory:

```bash
docker compose up
```

Starts two containers:

| Service | URL | Notes |
|---------|-----|-------|
| API (HTTP) | `http://localhost:3001` | |
| API (HTTPS) | `https://localhost:3443` | Self-signed cert — accept browser warning |
| Swagger UI | `http://localhost:3001/api-docs` | |
| OpenAPI JSON | `http://localhost:3001/swagger.json` | |
| Proxy | `http://localhost:3002` | Forwards to the API container |

To stop: `docker compose down`

---

### Development (npm)

Use this method when modifying or extending the test server itself.

#### Prerequisites

- Node.js 18+
- npm

#### Start

```bash
cd test-server
npm install
npm run dev
```

Server starts at:
- **HTTP API:** `http://localhost:3001`
- **HTTPS API:** `https://localhost:3443` *(after gen-certs)*
- **Swagger UI:** `http://localhost:3001/api-docs`
- **OpenAPI JSON:** `http://localhost:3001/swagger.json`

#### Generate HTTPS Certificates

Required for SSL verification tests (Scenario 27):

```bash
npm run gen-certs
```

Then restart the server — it will automatically pick up the certs.

#### Start the Proxy Server

In a **separate terminal**, for proxy tests (Scenario 28):

```bash
npm run proxy
```

Proxy runs on `http://localhost:3002` and forwards to the target defined by `PROXY_TARGET` in your `.env` (default: `http://localhost:3001`).

Copy `.env.example` to `.env` to customise ports and proxy target:

```bash
cp .env.example .env
```

#### Build for Production

```bash
npm run build
npm start
```

---

## All Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/status/:code` | Respond with given HTTP status (200–599) |
| GET | `/delay/:ms` | Respond after N ms (max 3000) |
| GET | `/echo` | Echo GET request |
| POST | `/echo` | Echo POST request |
| PUT | `/echo` | Echo PUT request |
| PATCH | `/echo` | Echo PATCH request |
| DELETE | `/echo` | Echo DELETE request |
| HEAD | `/echo` | Headers-only response |
| OPTIONS | `/echo` | CORS preflight |
| GET | `/params` | Echo query parameters |
| GET | `/params/required` | Require `?name=&page=` (400 if missing) |
| GET | `/headers` | Echo all request headers |
| GET | `/headers/required` | Require `X-Custom-Header` (400 if missing) |
| POST | `/body/json` | Parse + echo JSON body |
| POST | `/body/form` | Parse + echo URL-encoded form |
| POST | `/body/validate` | Validate `name` + `email` (422 if missing) |
| POST | `/body/multipart` | Parse multipart form-data with fields and files |
| POST | `/body/binary` | Accept raw binary body and return metadata |
| POST | `/graphql` | Echo GraphQL query and variables |
| GET | `/auth/bearer` | Bearer `test-token-123` (401 if wrong) |
| GET | `/auth/basic` | Basic `admin:password123` (401 if wrong) |
| GET | `/auth/apikey` | `X-API-Key: api-key-xyz` or `?api_key=api-key-xyz` |
| POST | `/auth/login` | `{ username: "demo", password: "demo123" }` → token |
| GET | `/auth/me` | Profile (requires login token) |
| GET | `/users/:id` | User by ID (requires login token — chaining target) |
| GET | `/data/users` | Fixed list of 5 users (Alice, Bob, Charlie, Diana, Eve) |
| GET | `/data/user/:id` | Single user by ID (404 if not found) |
| GET | `/debug/echo` | Full debug echo: method, headers, query, body, ip |
| GET | `/cookies/set` | Set cookies from query parameters via `Set-Cookie` |
| GET | `/cookies/read` | Parse and echo incoming `Cookie` header |
| GET | `/cookies/clear` | Expire known test cookies |
| GET | `/api-docs` | Swagger UI |
| GET | `/swagger.json` | OpenAPI 3.0 JSON |
| GET | `/swagger-dynamic.json` | Rotating OpenAPI spec (6 scenarios, 1/min) |

---

## Dynamic Sync Endpoint

`GET /swagger-dynamic.json` serves a deterministically rotating OpenAPI 3.0.0 spec for
testing OlympAPI's Auto Sync feature. The active scenario changes every minute.

| Query param | Effect |
|-------------|--------|
| *(none)* | Auto-rotate: `Math.floor(Date.now() / 60_000) % 6` |
| `?scenario=N` | Force scenario N (0–5) |
| `?info` | Return metadata JSON only (no spec) |

**Response headers:** `X-Sync-Scenario`, `X-Sync-Version`, `X-Sync-Next-Change-In`,
`Cache-Control: public, max-age=<seconds-until-next-change>`

### Scenarios

| # | Label | Version | Change summary |
|---|-------|---------|----------------|
| 0 | Baseline | 1.0.0 | `/dynamic/users` (GET+POST), `/dynamic/users/{id}` (GET+PUT+DELETE), `/dynamic/products` (GET) |
| 1 | Add bulk-import | 1.1.0 | + `POST /dynamic/users/bulk-import` |
| 2 | Extend user lookup | 1.2.0 | `GET /dynamic/users/{id}` gains `include_deleted` param + 410 response |
| 3 | Remove delete + audit log | 1.3.0 | DELETE removed from `/dynamic/users/{id}`; + `GET /dynamic/audit-log` (BearerAuth) |
| 4 | Extended creation + products write | 1.4.0 | `POST /dynamic/users` gains `role`/`phone`/409; + `POST /dynamic/products` |
| 5 | Back to baseline | 1.5.0 | Identical to scenario 0 (completes cycle) |

---

## Credentials Reference

| Auth Type | Credential |
|-----------|-----------|
| Bearer Token | `test-token-123` |
| Basic Auth | `admin` / `password123` |
| API Key | `api-key-xyz` (header `X-API-Key` or query `?api_key=`) |
| Login | `demo` / `demo123` → token `jwt-abc-xyz-123` |

---

## Test Scenarios

See [`docs/TEST_SCENARIOS.md`](docs/TEST_SCENARIOS.md) for all 63 detailed test scenarios covering:

| # | Feature |
|---|---------|
| 01 | GET + Environment Variable |
| 02 | POST with JSON Body |
| 03–07 | PUT, PATCH, DELETE, HEAD, OPTIONS |
| 08–09 | Query Parameters (optional + required) |
| 10 | Custom Request Header |
| 11–12 | Form Body, Body Validation (422) |
| 13–16 | Bearer, Basic, API Key (header + query) |
| 17–18 | Pre-Request Scripts (set header, set env var) |
| 19 | Request Chaining (login → get user) |
| 20–23 | Response Tests (status, body, time, header) |
| 24 | OpenAPI Import |
| 25 | Postman Collection Import |
| 26 | Postman Export + Re-Import |
| 27–31 | SSL, Proxy, Multipart, Binary, GraphQL |
| 32–42 | Workspaces, Tabs, Git Sync, Settings cascade, Response layout |
| 43–46 | Cookie Jar receive, send, override, and delete |
| 47–51 | Proxy status bar, workspace scope/history, workspace Git Sync, Reset All Data |
| 52–68 | Extended scenarios |

---

## API Client Collections
[docs/COLLECTIONS/OlympAPI Test Server - Bruno.yml](<docs/COLLECTIONS/OlympAPI Test Server - Bruno.yml>)
[docs/COLLECTIONS/OlympAPI Test Server - Insomnia.yaml](<docs/COLLECTIONS/OlympAPI Test Server - Insomnia.yaml>)
[docs/COLLECTIONS/OlympAPI Test Server - Postman.json](<docs/COLLECTIONS/OlympAPI Test Server - Postman.json>)
[docs/COLLECTIONS/OlympAPI Test Server- swagger.json](<docs/COLLECTIONS/OlympAPI Test Server- swagger.json>)
