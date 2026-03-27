# Security Policy

## Reporting a Vulnerability

If you discover a security issue, do not open a public GitHub issue with exploit details.

Instead:

- report the issue privately to the repository maintainers
- include a short description, impact, and reproduction steps
- avoid posting secrets, tokens, or personal data

## Scope Notes

This repository is a public frontend.

Important security expectations:

- secrets must not be committed
- frontend must not own policy decision logic
- backend URLs and credentials must be configured through environment variables
- public UI must avoid exposing sensitive operational details

