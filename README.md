# OlympAPI

Native desktop API client for Windows and Linux.

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

