# Malone Contact Desk Backend

This folder contains the smallest server-side layer for the static GitHub Pages website.

It is a standalone Google Apps Script web app that:

- runs as the deploying Malone Google Workspace user;
- accepts the `/contact` form through a hidden iframe transport;
- validates and sanitizes every field server-side;
- applies a honeypot, minimum-form-age check, duplicate protection, global throttling, and per-email throttling;
- sends one notification to the configured Malone owner; never emails an unverified form address;
- uses `MailApp`, which can send mail but cannot read the Gmail inbox;
- stores short-lived per-email counters and request state in Apps Script cache, and aggregate budgets in Script Properties;
- does not persist raw submissions;
- never returns recipient information to the browser.

## Owner setup and safe defaults

Create a standalone Apps Script project while signed in as the Workspace identity that should send the messages.

Add:

- `Code.gs`
- `appsscript.json`

The current production release has safe built-in defaults for message delivery and
callback origin. Script Properties are optional overrides unless a future,
separately authorized release says otherwise.

| Property | Current behavior |
| --- | --- |
| `MALONE_NOTIFICATION_TO` | Optional override. When unset, the backend uses the safe production default `curtis@maloneintegratedtech.com`. |
| `ALLOWED_ORIGIN` | Optional override. When unset, the backend uses the current production origin `https://www.maloneintegratedtech.com`. |
| `BOOKING_URL` | Optional, dormant backend-only configuration. Leave it unset for the current hard-off release. |
| `MEETING_REQUESTS_ENABLED` | Defaults off. Only the exact string `true` permits the backend meeting path; leave unset or `false` for the current hard-off release. |

If `BOOKING_URL` is ever configured, it must be an HTTPS Google scheduling URL.
The backend rejects direct meeting requests before lead recording, cache, quota,
or mail side effects unless `MEETING_REQUESTS_ENABLED` is exactly `true` and the
booking URL is valid. A configured URL alone does not enable backend acceptance.
Setting these properties does not enable the public meeting interface by itself:
the current frontend keeps that control hidden and disabled. Re-enabling meeting
requests requires an explicit code and configuration change plus fresh live
acceptance.

Deploy as a Web app:

- Execute as: `Me`
- Who has access: `Anyone`

Authorize only the manifest scope:

- `https://www.googleapis.com/auth/script.send_mail`

Copy the final URL ending in `/exec`.

## GitHub Pages configuration

Create this GitHub Actions repository variable:

- Name: `PUBLIC_CONTACT_ENDPOINT`
- Value: the Apps Script `/exec` URL

The endpoint is public routing information, not a credential. OAuth authorization and the scheduling URL remain in Apps Script.

Do not commit:

- OAuth tokens
- Apps Script authorization material
- `.clasp.json`
- local `.env` files
- mail credentials

## Verification sequence

1. Load `https://www.maloneintegratedtech.com/contact`.
2. Confirm malformed and incomplete inputs remain on the page with accessible errors.
3. Submit from a non-Malone external email address.
4. Confirm the Malone notification reaches `curtis@maloneintegratedtech.com`.
5. Confirm the browser shows receipt and the submitted message; no email is sent to the unverified sender address.
6. On desktop and mobile, select each of the five public contact categories and confirm the meeting control remains hidden, unchecked, and disabled.
7. Submit a normal inquiry and confirm its request does not contain `meetingRequested=yes`.
8. Confirm the Malone notification contains no discovery-meeting marker or scheduling link.
9. Confirm the browser confirmation state does not expose a scheduling link.
10. Run the backend harness and confirm direct meeting requests fail closed without lead recording, cache, mail, or scheduling-link disclosure when `MEETING_REQUESTS_ENABLED` is absent/disabled, even with a valid `BOOKING_URL` or cached completion. Explicitly enabled requests must still reject absent or malformed URLs.

## Future meeting re-enable procedure (not currently authorized)

Do not perform these steps under the current release authority. A future meeting
release requires all of the following:

1. Obtain explicit owner authorization and the approved Google Appointment Schedule URL.
2. Configure `BOOKING_URL` and explicitly set `MEETING_REQUESTS_ENABLED=true` only under that future authorization; make a matching frontend change that unhides and enables the accessible meeting control where appropriate.
3. Update the frontend and backend acceptance tests for the newly authorized behavior.
4. Deploy a new immutable Apps Script version and the matching frontend release.
5. Repeat live acceptance for the browser response, owner notification, scheduling link, duplicate prevention, and the authorized test appointment lifecycle.

Configuring `BOOKING_URL` alone is never sufficient evidence that meeting requests
are enabled or accepted.

## Security budgets and release gate

Anonymous submissions have no verified sender identity. The browser confirms receipt;
the supplied address is used only as the owner notification's reply address and lead
contact field. Sending customer mail requires a future verified-recipient design.

Under the script lock, persistent shared budgets cap side-effect attempts at 5 per
minute, 20 per ten minutes, and 100 per day, regardless of email or request ID.
Each window starts with its first reservation and resets after its duration.
Failed delivery attempts consume budget; completed cached replays do not. The
existing three-per-email cache throttle remains secondary. Cache eviction cannot
reset shared budgets. `MALONE_CONTACT_RATE_STATE_V1` contains only aggregate counts
and expiry timestamps; do not clear it to bypass throttling. Malformed state or
failed persistence fails closed. These caps bound anonymous traffic but cannot
prevent a determined sender from exhausting the channel; direct email remains available.

The repository workflow only builds/deploys `main`, including manual dispatch, and
only the deployment job receives Pages/OIDC write permissions. As checked on
2026-10-05, Pages already allows only `main`, but `main` has no branch protection or
rulesets. Code cannot require review of pushes to an unprotected branch. Any
protection or environment-review changes require separate owner approval.

Pushing the remediation branch or opening its draft PR does not release this code.
Release requires owner-approved merge to `main` (which triggers Pages), then a
separately approved immutable Apps Script version/update of the existing `/exec`
deployment and controlled acceptance. GitHub Pages does not deploy `Code.gs`.
Do not claim backend remediation is live from a website deployment alone.

The printed business-card QR remains unchanged and continues to point to:

`https://www.maloneintegratedtech.com/contact`
