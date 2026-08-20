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

## Required owner setup

Create a standalone Apps Script project while signed in as the Workspace identity that should send the messages.

Add:

- `Code.gs`
- `appsscript.json`

Set these Script Properties:

| Property | Required value |
| --- | --- |
| `MALONE_NOTIFICATION_TO` | `curtis@maloneintegratedtech.com` |
| `ALLOWED_ORIGIN` | `https://www.maloneintegratedtech.com` |
| `BOOKING_URL` | The exact public Google Appointment Schedule URL |

`BOOKING_URL` must be an HTTPS Google scheduling URL. The backend fails closed for meeting requests if it is absent or malformed.

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
6. Repeat with the meeting checkbox selected.
7. Confirm the Malone subject begins with `DISCOVERY MEETING REQUESTED`.
8. Confirm the customer email and page show the Google scheduling link.
9. Book an available test slot and confirm Google creates the Calendar event and Google Meet link.
10. Remove or retain the test event according to the owner's preference.

The printed business-card QR remains unchanged and continues to point to:

`https://www.maloneintegratedtech.com/contact`
