# OlympAPI

Native desktop API client for Windows and Linux.

[![Latest Release](https://img.shields.io/github/v/release/OlympProject/olympapi-release?display_name=release&style=for-the-badge&logo=github)](https://github.com/OlympProject/olympapi-release/releases/latest)
[![Releases](https://img.shields.io/badge/Releases-All%20versions-1f6feb?style=for-the-badge&logo=github)](https://github.com/OlympProject/olympapi-release/releases)
[![Download Latest](https://img.shields.io/badge/Download-Latest%20Release-2ea043?style=for-the-badge&logo=github)](https://github.com/OlympProject/olympapi-release/releases/latest)
[![Website](https://img.shields.io/badge/Website-olympstack.com%2Folympapi-0a66c2?style=for-the-badge&logo=googlechrome&logoColor=white)](https://olympstack.com/olympapi)

[![Validation Suite](https://img.shields.io/badge/Validation%20Suite-Docker%20%2B%20Docs-6f42c1?style=for-the-badge&logo=docker&logoColor=white)](https://github.com/OlympProject/olympapi-release/tree/main/olympapi-validation-suite)
[![User Manual](https://img.shields.io/badge/User%20Manual-Read-cd7f32?style=for-the-badge&logo=readme&logoColor=white)](USERMANUAL.md)
[![EULA](https://img.shields.io/badge/EULA-View-8250df?style=for-the-badge&logo=github)](EULA.md)
[![Packages GHCR](https://img.shields.io/badge/Packages-GHCR-0969da?style=for-the-badge&logo=github)](https://github.com/OlympProject/olympapi-release/pkgs/container/olympapi-validation-suite)

OlympAPI is built for developers who want full control over local workflows, data ownership and Git-based collaboration without forced cloud lock-in.

- Website: [olympstack.com/olympapi](https://olympstack.com/olympapi)
- Releases: [OlympAPI releases](https://github.com/OlympProject/olympapi-release/releases)
- User Manual: [USERMANUAL.md](USERMANUAL.md)
- EULA: [EULA.md](EULA.md)

---

## Why OlympAPI

- Native desktop app (Windows + Linux)
- Local-first workflow with optional Git Sync
- Import and export support across major API client formats
- No subscription required for core usage
- Lifetime license option for full Pro workflow

---

## Screenshots

### HTTP Request with JSON Body

![HTTP request with JSON body and 200 response – light mode](screenshots/BodyJSONRequestWithJsonResponse200SuccessCodeTestLightMode.png#gh-light-mode-only)
![HTTP request with JSON body and 200 response – dark mode](screenshots/BodyJSONRequestWithJsonResponse200SuccessCodeTestDarkMode.png#gh-dark-mode-only)

### Bearer Token Authentication

![Bearer token auth with 200 status – light mode](screenshots/RequestWithBearerAuthWindowOpenStatus200AuthenticatedLightMode.png#gh-light-mode-only)
![Bearer token auth with 200 status – dark mode](screenshots/RequestWithBearerAuthWindowOpenStatus200AuthenticatedDarkMode.png#gh-dark-mode-only)

### Environments and Variables

![Environment variables editor – light mode](screenshots/EnvironmentsWindowEnvironmentSelectedWithVariablesAndKeysEditLightMode.png#gh-light-mode-only)
![Environment variables editor – dark mode](screenshots/EnvironmentsWindowEnvironmentSelectedWithVariablesAndKeysEditDarkMode.png#gh-dark-mode-only)

### Git Sync

![Git Sync collection in sync – light mode](screenshots/GitSyncWindowCollectionInSyncLightMode.png#gh-light-mode-only)
![Git Sync collection in sync – dark mode](screenshots/GitSyncWindowCollectionInSyncDarkMode.png#gh-dark-mode-only)

### Response Tests

![Test assertion – status code equals 200 – light mode](screenshots/TestsAddAssertationStatusCodeEqualsWithExpectedValueLightMode.png#gh-light-mode-only)
![Test assertion – status code equals 200 – dark mode](screenshots/TestsAddAssertationStatusCodeEqualsWithExpectedValueDarkMode.png#gh-dark-mode-only)

### OpenAPI Auto Sync (Pro)

![Configure OpenAPI Auto Sync – light mode](screenshots/ConfigureAutoSyncWithOpenAPISwaggerAndValidationSuiteLightMode.png#gh-light-mode-only)
![Configure OpenAPI Auto Sync – dark mode](screenshots/ConfigureAutoSyncWithOpenAPISwaggerAndValidationSuiteDarkMode.png#gh-dark-mode-only)

---

## Core Features

### Free

- HTTP requests with full method/body/header/auth control
- Collections and environments
- OpenAPI / Swagger import
- Postman, Bruno and Insomnia compatibility workflows
- Request history and proxy support

### Pro

- Unlimited collections, environments and workspaces
- Pre-request / post-request scripts
- Response tests and request chaining
- OpenAPI auto sync with change review
- Extended Git Sync workflows

---

## Git Sync (GitHub + Forgejo)

OlympAPI Git Sync is designed for teams that already work with Git and want transparent API collaboration.

- Sync collections or full workspaces
- Use your own Git hosting (GitHub, Forgejo and compatible remotes)
- Keep sensitive values out of commits via placeholder scrubbing
- Resolve conflicts explicitly (no hidden auto-merge)

Docs and guidance:
- [OlympAPI Docs](https://olympstack.com/olympapi/docs)
- [Git Sync Solution Guide](https://olympstack.com/solutions/git-sync-self-hosted)

---

## OlympAPI Validation Suite (Docker)

The Validation Suite is the official end-to-end test server for OlympAPI workflows.

Quick run via GHCR:

```bash
docker pull ghcr.io/olympproject/olympapi-validation-suite:vX.Y.Z
docker pull ghcr.io/olympproject/olympapi-validation-suite:latest
docker run --rm -p 3001:3001 -p 3443:3443 \
	ghcr.io/olympproject/olympapi-validation-suite:vX.Y.Z
```

Replace `vX.Y.Z` with a release tag from:
- [OlympAPI releases](https://github.com/OlympProject/olympapi-release/releases)

Validation Suite references:
- [Suite repository directory](https://github.com/OlympProject/olympapi-release/tree/main/olympapi-validation-suite)
- [Validation Suite README](https://github.com/OlympProject/olympapi-release/blob/main/olympapi-validation-suite/README.md)
- [Validation scenarios](https://github.com/OlympProject/olympapi-release/blob/main/olympapi-validation-suite/docs/TEST_SCENARIOS.md)
- [GHCR package page](https://github.com/OlympProject/olympapi-release/pkgs/container/olympapi-validation-suite)
- [GitHub packages index](https://github.com/OlympProject?tab=packages&repo_name=olympapi-release)

---

## Downloads

Every release includes:

- Windows installer
- Windows zip package
- Linux tar.gz package
- SHA256 checksums
- Optional signature artifacts

Get the latest release assets:
- [Latest release](https://github.com/OlympProject/olympapi-release/releases/latest)

---

## Security and Verification

- Verify downloaded binaries with `SHA256SUMS.txt`
- Use signature files when available
- Keep activation tokens and sensitive environment values private

---

## Documentation

- [OlympAPI User Manual](USERMANUAL.md)
- [OlympAPI EULA](EULA.md)
- [OlympAPI Docs on olympstack.com](https://olympstack.com/olympapi/docs)

---

## Support

- Product and licensing: contact@olympstack.com
- Technical support: support@olympstack.com

---

## OlympStack Suite

OlympStack is a suite of native desktop tools for developers and DevOps engineers.

| App | Repository |
|-----|------------|
| OlympAPI | [github.com/OlympProject/olympapi-release](https://github.com/OlympProject/olympapi-release) |
| OlympAtlas | [github.com/OlympProject/olympatlas-release](https://github.com/OlympProject/olympatlas-release) |
| OlympCron Manager | [github.com/OlympProject/olympcron-manager-release](https://github.com/OlympProject/olympcron-manager-release) |
| OlympSSH Commander | [github.com/OlympProject/olympssh-commander-release](https://github.com/OlympProject/olympssh-commander-release) |
| OlympTest Manager | [github.com/OlympProject/olymptest-manager-release](https://github.com/OlympProject/olymptest-manager-release) |

