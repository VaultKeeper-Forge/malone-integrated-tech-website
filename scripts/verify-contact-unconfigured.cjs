const assert = require('node:assert/strict');
const fs = require('node:fs');

assert(process.argv[2], 'Usage: node verify-contact-unconfigured.cjs <built-contact-html>');
const html = fs.readFileSync(process.argv[2], 'utf8');
const form = html.match(/<form\b[^>]*\bdata-contact-form\b[^>]*>/i)?.[0];
const submit = html.match(/<button\b[^>]*\bdata-submit-button\b[^>]*>/i)?.[0];
assert(form, 'Built page must contain the contact form.');
assert(submit, 'Built page must contain the submit button.');
assert.doesNotMatch(form, /\saction=/i, 'Unconfigured form must have no submission action.');
assert.match(submit, /\sdisabled(?:\s|=|>)/i, 'Unconfigured form must disable submission.');
assert.doesNotMatch(html, /class="cf-turnstile"/i, 'Unconfigured form must omit the widget.');
assert.doesNotMatch(html, /challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/i,
  'Unconfigured form must omit the challenge script.');
assert.match(html, /Please use the direct email option beside this form\./,
  'Unconfigured form must explain the direct email fallback.');
assert.match(html, /href="mailto:[^"]+"/i, 'Built page must retain a direct email link.');
console.log('PASS: missing contact configuration fails closed with direct email fallback.');
