# Malone Contact Desk Backend

This directory contains source and tests for the Google Apps Script backend used by the production website's contact form. The static frontend and this backend are deployed independently; publishing the website does not publish Apps Script source.

## Public behavior

- Validates inquiries server-side and applies abuse controls before side effects.
- Sends an owner notification for accepted inquiries; it does not email user-supplied content to an unverified form address.
- Provides a browser receipt. A configured endpoint, health response, or browser receipt alone is not proof that an email reached the owner's inbox.
- Keeps meeting requests disabled in the current frontend and disabled by default in the backend. Future scheduling changes require a separately approved release and acceptance checks.

The website's unconnected Vault adapter is a separate integration boundary, not a description of this deployed contact backend.

## Source and local verification

- `apps-script/Code.gs` contains backend source.
- `apps-script/appsscript.json` contains the Apps Script manifest.
- `Code.test.cjs` exercises backend behavior with mocked services; local tests do not send production email.

After building the frontend, run the backend harness from the repository root:

```sh
node contact-backend/Code.test.cjs contact-backend/apps-script/Code.gs dist/contact/index.html
```

These checks establish local behavior, not production delivery or live deployment state. Live contact submissions and email acceptance tests require explicit owner authorization.

## Release and operational documentation

Follow the release requirements in [AGENTS.md](../AGENTS.md). A merge to `main`, even for documentation alone, triggers the existing Pages workflow. Backend publication requires a separate owner-approved Apps Script release and independent verification.

Deployment configuration, notification recipients, operational acceptance records, and rollback procedures are maintained in private owner documentation. Consult that documentation before operating the service. Never commit credentials, OAuth tokens, local provider configuration, or private operational backups.
