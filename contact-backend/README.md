# Malone Contact Desk Backend

This folder contains the smallest server-side layer for the static GitHub Pages website.

It is a standalone Google Apps Script web app that:

- runs as the deploying Malone Google Workspace user;
- accepts the `/contact` form through a hidden iframe transport;
- validates and sanitizes every field server-side;
- applies a honeypot, minimum-form-age check, duplicate protection, global throttling, and per-email throttling;
- sends a Malone notification and a separate customer confirmation;
- uses `MailApp`, which can send mail but cannot read the Gmail inbox;
- stores only short-lived counters and request state in Apps Script cache;
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

If `BOOKING_URL` is ever configured, it must be an HTTPS Google scheduling URL.
The backend fails closed for meeting requests when it is absent or malformed.
Setting this property does not enable the public meeting interface by itself:
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
5. Confirm the external sender receives a separate confirmation containing the submitted message.
6. On desktop and mobile, select each of the five public contact categories and confirm the meeting control remains hidden, unchecked, and disabled.
7. Submit a normal inquiry and confirm its request does not contain `meetingRequested=yes`.
8. Confirm neither the Malone notification nor the customer confirmation contains a discovery-meeting marker or scheduling link.
9. Confirm the browser confirmation state does not expose a scheduling link.
10. Run the backend harness and confirm a direct meeting request fails closed without sending mail when `BOOKING_URL` is absent or malformed.

## Future meeting re-enable procedure (not currently authorized)

Do not perform these steps under the current release authority. A future meeting
release requires all of the following:

1. Obtain explicit owner authorization and the approved Google Appointment Schedule URL.
2. Configure `BOOKING_URL` and make an explicit frontend change that unhides and enables the accessible meeting control where appropriate.
3. Update the frontend and backend acceptance tests for the newly authorized behavior.
4. Deploy a new immutable Apps Script version and the matching frontend release.
5. Repeat live acceptance for the browser response, both email paths, the scheduling link, duplicate prevention, and the authorized test appointment lifecycle.

Configuring `BOOKING_URL` alone is never sufficient evidence that meeting requests
are enabled or accepted.

The printed business-card QR remains unchanged and continues to point to:

`https://www.maloneintegratedtech.com/contact`
