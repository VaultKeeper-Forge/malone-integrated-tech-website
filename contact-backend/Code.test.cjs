const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const vm = require('node:vm');

const [codePath, htmlPath] = process.argv.slice(2);
assert(codePath && htmlPath, 'Usage: node Code.test.cjs <Code.gs> <built-contact-html>');

const source = fs.readFileSync(codePath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');
const NativeDate = Date;
const fixedNowMs = NativeDate.parse('2026-09-04T07:30:00.000Z');
let nowMs = fixedNowMs;

class TestDate extends NativeDate {
  constructor(...args) {
    if (args.length === 0) super(nowMs);
    else super(...args);
  }

  static now() {
    return nowMs;
  }
}

const defaultProps = Object.freeze({
  MALONE_NOTIFICATION_TO: 'curtis@maloneintegratedtech.com',
  ALLOWED_ORIGIN: 'https://www.maloneintegratedtech.com',
  BOOKING_URL: 'https://calendar.app.google/TEST-MALONE-BOOKING',
  MALONE_INBOUND_LEAD_BRIDGE_ENABLED: 'true',
  MALONE_INBOUND_LEAD_ENDPOINT: 'https://malone-client-operations-platform.vercel.app/api/inbound-leads',
  MALONE_INBOUND_LEAD_HMAC_SECRET: 'test-secret-with-at-least-thirty-two-bytes',
});
const props = { ...defaultProps };
const cache = new Map();
const cacheEvents = [];
const sent = [];
const mailAttempts = [];
const quotaEvents = [];
const logs = [];
const inboundRequests = [];
const htmlOutputs = [];
const lockStats = { gets: 0, tries: 0, releases: 0, timeouts: [] };
let cacheServiceGets = 0;
let quota = 1000;
let lockAvailable = true;
let lockHeld = false;
let failRecipientOnce = '';
let inboundResponseCode = 201;
let inboundResponseOverride = null;

function requireLock(operation) {
  assert.equal(lockHeld, true, `${operation} occurred without the script lock.`);
}

const cacheApi = {
  get(key) {
    requireLock(`Cache get ${key}`);
    cacheEvents.push({ operation: 'get', key, lockHeld });
    return cache.has(key) ? cache.get(key) : null;
  },
  put(key, value, expirationSeconds) {
    requireLock(`Cache put ${key}`);
    cacheEvents.push({
      operation: 'put',
      key,
      value: String(value),
      expirationSeconds,
      lockHeld,
    });
    cache.set(key, String(value));
  },
  remove(key) {
    requireLock(`Cache remove ${key}`);
    cacheEvents.push({ operation: 'remove', key, lockHeld });
    cache.delete(key);
  },
};

const scriptLock = {
  tryLock(timeoutMs) {
    lockStats.tries += 1;
    lockStats.timeouts.push(timeoutMs);
    assert.equal(timeoutMs, 1500, 'Script lock timeout changed unexpectedly.');
    if (!lockAvailable) return false;
    assert.equal(lockHeld, false, 'Nested script-lock acquisition attempted.');
    lockHeld = true;
    return true;
  },
  releaseLock() {
    assert.equal(lockHeld, true, 'Script lock released when it was not held.');
    lockHeld = false;
    lockStats.releases += 1;
  },
};

const normalizeMail = (args) => args.length === 1 && typeof args[0] === 'object'
  ? { ...args[0] }
  : { to: args[0], subject: args[1], body: args[2], ...(args[3] || {}) };

const context = {
  CacheService: {
    getScriptCache() {
      requireLock('CacheService.getScriptCache');
      cacheServiceGets += 1;
      return cacheApi;
    },
  },
  LockService: {
    getScriptLock() {
      assert.equal(lockHeld, false, 'Nested LockService.getScriptLock call detected.');
      lockStats.gets += 1;
      return scriptLock;
    },
  },
  PropertiesService: {
    getScriptProperties: () => ({
      getProperty: (key) => props[key] ?? null,
    }),
  },
  MailApp: {
    getRemainingDailyQuota() {
      requireLock('MailApp.getRemainingDailyQuota');
      quotaEvents.push({ quota, lockHeld });
      return quota;
    },
    sendEmail(...args) {
      requireLock('MailApp.sendEmail');
      const mail = normalizeMail(args);
      mailAttempts.push({ ...mail, lockHeld });
      if (failRecipientOnce && mail.to === failRecipientOnce) {
        failRecipientOnce = '';
        throw new Error(`Simulated mail failure for ${mail.to}`);
      }
      sent.push(mail);
    },
  },
  UrlFetchApp: {
    fetch(url, options) {
      requireLock('UrlFetchApp.fetch');
      const parsed = JSON.parse(options.payload);
      inboundRequests.push({ url, options: { ...options, headers: { ...options.headers } }, parsed, lockHeld });
      const body = inboundResponseOverride || {
        state: 'RECORDED',
        contractVersion: 'mit-inbound-lead-v1',
        data: {
          leadId: '00000000-0000-4000-8000-000000000001',
          requestId: parsed.requestId,
          status: 'new',
          idempotentReplay: inboundResponseCode === 200,
        },
      };
      return {
        getResponseCode: () => inboundResponseCode,
        getContentText: () => JSON.stringify(body),
      };
    },
  },
  HtmlService: {
    XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' },
    createHtmlOutput(value) {
      const output = {
        value: String(value),
        title: '',
        frameMode: '',
        setTitle(title) {
          this.title = String(title);
          return this;
        },
        setXFrameOptionsMode(mode) {
          this.frameMode = mode;
          return this;
        },
        getContent() {
          return this.value;
        },
      };
      htmlOutputs.push(output);
      return output;
    },
  },
  Utilities: {
    Charset: { UTF_8: 'UTF_8' },
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    formatDate: (date) => new NativeDate(date).toISOString(),
    computeDigest: (_algorithm, value) => [
      ...crypto.createHash('sha256').update(String(value)).digest(),
    ],
    computeHmacSha256Signature: (value, secret) => [
      ...crypto.createHmac('sha256', String(secret)).update(String(value)).digest(),
    ],
  },
  Session: { getScriptTimeZone: () => 'America/Los_Angeles' },
  console: {
    log: (...args) => logs.push(['log', ...args]),
    warn: (...args) => logs.push(['warn', ...args]),
    error: (...args) => logs.push(['error', ...args]),
  },
  Date: TestDate,
  JSON,
  Math,
  Number,
  Object,
  RegExp,
  String,
  Array,
  Boolean,
  Error,
};

vm.createContext(context);
vm.runInContext(source, context, { filename: codePath });
assert.equal(typeof context.doGet, 'function', 'Code.gs must expose doGet.');
assert.equal(typeof context.doPost, 'function', 'Code.gs must expose doPost.');

const categoryBlock = html.match(/<select[^>]*name="category"[^>]*>[\s\S]*?<\/select>/i);
assert(categoryBlock, 'Built form must contain category selector.');
const categories = [...categoryBlock[0].matchAll(/<option[^>]*value="([^"]+)"/gi)]
  .map((match) => match[1].trim())
  .filter(Boolean);
assert.deepEqual(categories, [
  'Local on-site IT support',
  'Computer / device help',
  'Website help',
  'Business systems / automation / AI',
  'Not sure — help me figure it out',
], 'Built form categories drifted from the approved V2 contact contract.');
for (const field of [
  'name',
  'email',
  'organization',
  'category',
  'message',
  'website',
  'formId',
  'requestId',
  'formStartedAt',
  'meetingRequested',
  'privacyConsent',
]) {
  assert(html.includes(`name="${field}"`), `Built form missing ${field}.`);
}
assert.match(
  html,
  /<label[^>]*data-meeting-option[^>]*hidden[^>]*>/i,
  'Production build must hide online meeting requests until explicitly enabled.'
);
assert.match(
  html,
  /<input[^>]*name="meetingRequested"[^>]*disabled[^>]*>/i,
  'Production build must disable online meeting requests until explicitly enabled.'
);
assert.match(
  html,
  /<input[^>]*name="privacyConsent"[^>]*required[^>]*>/i,
  'Production build must require the published privacy notice.'
);

function reset() {
  cache.clear();
  cacheEvents.length = 0;
  sent.length = 0;
  mailAttempts.length = 0;
  quotaEvents.length = 0;
  logs.length = 0;
  inboundRequests.length = 0;
  htmlOutputs.length = 0;
  lockStats.gets = 0;
  lockStats.tries = 0;
  lockStats.releases = 0;
  lockStats.timeouts.length = 0;
  cacheServiceGets = 0;
  quota = 1000;
  lockAvailable = true;
  lockHeld = false;
  failRecipientOnce = '';
  inboundResponseCode = 201;
  inboundResponseOverride = null;
  nowMs = fixedNowMs;
  for (const key of Object.keys(props)) delete props[key];
  Object.assign(props, defaultProps);
}

function base(overrides = {}) {
  return {
    name: 'External Contact Test',
    email: 'external.test@example.com',
    organization: 'Verification Lab',
    category: categories[0],
    message: 'This complete message must appear in both independent email paths.',
    website: '',
    formId: 'malone-contact-v1',
    requestId: crypto.randomUUID(),
    formStartedAt: String(nowMs - 5000),
    privacyConsent: 'yes',
    ...overrides,
  };
}

function decodeOutput(result) {
  assert(result && typeof result.getContent === 'function', 'Handler must return HtmlOutput.');
  const content = result.getContent();
  const prefix = 'window.top.postMessage(';
  const start = content.indexOf(prefix);
  const end = content.indexOf(');</script>', start);
  assert(start >= 0 && end > start, 'Response did not contain the callback script.');
  const args = content.slice(start + prefix.length, end);
  const delimiter = args.lastIndexOf(',');
  assert(delimiter > 0, 'Response callback did not contain a target origin.');
  return {
    content,
    payload: JSON.parse(args.slice(0, delimiter)),
    targetOrigin: JSON.parse(args.slice(delimiter + 1)),
    output: result,
  };
}

function post(parameters) {
  const decoded = decodeOutput(context.doPost({ parameter: parameters }));
  assert.equal(lockHeld, false, 'doPost returned while retaining the script lock.');
  return decoded;
}

function postEvent(event) {
  const decoded = decodeOutput(context.doPost(event));
  assert.equal(lockHeld, false, 'doPost returned while retaining the script lock.');
  return decoded;
}

function getHealth() {
  const decoded = decodeOutput(context.doGet());
  assert.equal(lockHeld, false, 'doGet unexpectedly retained the script lock.');
  return decoded;
}

const mailContent = (mail) => [mail.subject, mail.body, mail.htmlBody].join('\n');
const recipient = (mail) => String(mail.to || '');
const requestKey = (request) => `request:${request.requestId}`;

function assertNoRecipientLeak(response) {
  assert(
    !response.content.includes(defaultProps.MALONE_NOTIFICATION_TO),
    'Response leaked the private Malone recipient.'
  );
}

function assertMailShape(mail, expected) {
  assert.equal(mail.to, expected.to, `${expected.label} recipient drifted.`);
  assert.equal(mail.replyTo, expected.replyTo, `${expected.label} replyTo drifted.`);
  assert.equal(mail.name, expected.name, `${expected.label} sender name drifted.`);
  assert.equal(mail.subject, expected.subject, `${expected.label} subject drifted.`);
  assert.equal(typeof mail.body, 'string', `${expected.label} plain-text body missing.`);
  assert.equal(typeof mail.htmlBody, 'string', `${expected.label} HTML body missing.`);
  assert.equal(mail.cc, undefined, `${expected.label} unexpectedly added CC.`);
  assert.equal(mail.bcc, undefined, `${expected.label} unexpectedly added BCC.`);
}

function assertNoBooking(response, mails) {
  assert.equal(response.payload.bookingUrl, undefined, 'Standard response exposed a booking URL.');
  for (const mail of mails) {
    assert(
      !mailContent(mail).includes(defaultProps.BOOKING_URL),
      'Standard or onsite mail unexpectedly included a booking URL.'
    );
  }
}

function assertNoRawCacheOrLogs(request) {
  const cacheText = JSON.stringify([...cache.entries()]);
  const logText = JSON.stringify(logs);
  for (const raw of [
    request.name,
    request.email,
    request.organization,
    request.category,
    request.message,
  ]) {
    if (!raw) continue;
    assert(!cacheText.includes(raw), `Cache retained raw submission content: ${raw.slice(0, 30)}`);
    assert(!logText.includes(raw), `Logs retained raw submission content: ${raw.slice(0, 30)}`);
  }
  assert.equal(logs.length, 0, 'Backend emitted console logs for a submission.');
}

function expectAccepted(label, overrides) {
  reset();
  const request = base(overrides);
  const response = post(request);
  assert.equal(response.payload.ok, true, `${label} should be accepted.`);
  assert.equal(sent.length, 2, `${label} should send exactly two messages.`);
  assertNoRecipientLeak(response);
  return { request, response };
}

function expectRejected(label, overrides, expectedMessage) {
  reset();
  const request = base(overrides);
  const response = post(request);
  assert.equal(response.payload.ok, false, `${label} should be rejected.`);
  assert.equal(response.payload.message, expectedMessage, `${label} returned the wrong error.`);
  assert.equal(sent.length, 0, `${label} sent mail despite rejection.`);
  assert.equal(cache.size, 0, `${label} wrote cache state despite validation failure.`);
  assert.equal(lockStats.gets, 0, `${label} acquired the script lock before validation completed.`);
  assertNoRecipientLeak(response);
  return response;
}

// GET health, callback target origin, response CSP, and safe origin fallbacks.
reset();
let health = getHealth();
assert.deepEqual(health.payload, {
  type: 'malone-contact-health',
  ok: true,
  status: 'ready',
});
assert.equal(health.targetOrigin, defaultProps.ALLOWED_ORIGIN);
assert(health.content.includes('default-src &apos;none&apos;'), 'Response CSP lost default-src none.');
assert(health.content.includes('script-src &apos;unsafe-inline&apos;'), 'Response CSP lost callback script allowance.');
assert.equal(health.output.title, 'Malone Contact Desk');
assert.equal(health.output.frameMode, 'ALLOWALL');
assert.equal(lockStats.gets, 0, 'GET health should not acquire a script lock.');

props.ALLOWED_ORIGIN = 'http://localhost:4334';
health = getHealth();
assert.equal(health.targetOrigin, 'http://localhost:4334', 'Approved localhost origin was rejected.');

props.ALLOWED_ORIGIN = 'https://attacker.example';
health = getHealth();
assert.equal(health.targetOrigin, defaultProps.ALLOWED_ORIGIN, 'Unapproved origin did not fail closed.');

delete props.ALLOWED_ORIGIN;
health = getHealth();
assert.equal(health.targetOrigin, defaultProps.ALLOWED_ORIGIN, 'Missing origin did not use canonical fallback.');

reset();
const injectionProbe = decodeOutput(context.contactResponse_({
  type: 'malone-contact-result',
  ok: false,
  message: '</script><script>alert("x")</script>',
}));
assert(
  !injectionProbe.content.includes('</script><script>alert'),
  'Response serialized an executable script-closing sequence.'
);
assert(
  injectionProbe.content.includes('\\u003c/script>\\u003cscript>alert'),
  'Response did not neutralize less-than characters in callback JSON.'
);

// Complete standard and onsite mail contracts, escaping, privacy, and lock ownership.
reset();
const standardRequest = base({
  name: 'Alex <Tester>',
  email: 'alex.tester@example.com',
  organization: 'A & B <Lab>',
  category: categories[4],
  message: 'Please review <script>alert("x")</script> & \'quoted\' content safely.',
});
const standardResponse = post(standardRequest);
assert.equal(inboundRequests.length, 1, 'Structured lead request was not attempted before the public failure response.');
assert.equal(standardResponse.payload.ok, true, standardResponse.payload.message);
assert.equal(standardResponse.payload.requestId, standardRequest.requestId);
assert.equal(sent.length, 2, 'Valid standard submission must send exactly two emails.');
assert.equal(inboundRequests[0].url, defaultProps.MALONE_INBOUND_LEAD_ENDPOINT);
assert.equal(inboundRequests[0].parsed.requestId, standardRequest.requestId);
assert.equal(inboundRequests[0].parsed.serviceLane, 'unsure');
assert.equal(inboundRequests[0].parsed.serviceCategory, 'unsure');
assert.equal(inboundRequests[0].parsed.privacyConsent, true);
assert.equal(inboundRequests[0].parsed.contactConsent, true);
assert.equal(inboundRequests[0].parsed.privacyVersion, 'mit-contact-privacy-2026-09-04');
assert.equal(inboundRequests[0].parsed.sourcePage, '/contact');
assert.equal(inboundRequests[0].parsed.sourceCta, 'contact_desk_submit');
const inboundTimestamp = inboundRequests[0].options.headers['X-Malone-Timestamp'];
const expectedInboundSignature = crypto
  .createHmac('sha256', defaultProps.MALONE_INBOUND_LEAD_HMAC_SECRET)
  .update(`${inboundTimestamp}.${inboundRequests[0].options.payload}`)
  .digest('hex');
assert.equal(inboundRequests[0].options.headers['X-Malone-Signature'], `sha256=${expectedInboundSignature}`);
const owner = sent.find((mail) => recipient(mail) === defaultProps.MALONE_NOTIFICATION_TO);
const customer = sent.find((mail) => recipient(mail) === standardRequest.email);
assert(owner && customer, 'Owner and customer mail paths must both run.');
assertMailShape(owner, {
  label: 'Owner mail',
  to: defaultProps.MALONE_NOTIFICATION_TO,
  replyTo: standardRequest.email,
  name: 'Malone Contact Desk',
  subject: `Malone website contact: ${standardRequest.category}`,
});
assertMailShape(customer, {
  label: 'Customer mail',
  to: standardRequest.email,
  replyTo: defaultProps.MALONE_NOTIFICATION_TO,
  name: 'Malone Integrated Tech',
  subject: 'We received your message | Malone Integrated Tech',
});
for (const mail of [owner, customer]) {
  assert(mail.body.includes(standardRequest.message), 'Plain-text mail omitted the complete message.');
  assert(mail.htmlBody.includes('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'), 'HTML mail did not escape script markup.');
  assert(mail.htmlBody.includes('&amp; &#39;quoted&#39;'), 'HTML mail did not escape ampersand/apostrophe content.');
}
assert(owner.htmlBody.includes('A &amp; B &lt;Lab&gt;'), 'Owner HTML omitted or failed to escape organization.');
assertNoBooking(standardResponse, [owner, customer]);
assertNoRecipientLeak(standardResponse);
assert.equal(cache.get(requestKey(standardRequest)), 'complete', 'Request state was not completed.');
assert.equal(lockStats.gets, 1, 'Standard request acquired more than one script lock.');
assert.equal(lockStats.tries, 1);
assert.equal(lockStats.releases, 1);
assert.equal(cacheServiceGets, 1);
assert.equal(quotaEvents.length, 1);
assert(cacheEvents.every((event) => event.lockHeld), 'Cache operation escaped the script lock.');
assert(mailAttempts.every((attempt) => attempt.lockHeld), 'Mail operation escaped the script lock.');
assert(quotaEvents.every((event) => event.lockHeld), 'Quota check escaped the script lock.');
assertNoRawCacheOrLogs(standardRequest);

reset();
const onsiteRequest = base({ category: 'Local on-site IT support' });
const onsiteResponse = post(onsiteRequest);
assert.equal(onsiteResponse.payload.ok, true);
assert.equal(sent.length, 2);
assert.equal(
  sent.find((mail) => mail.to === defaultProps.MALONE_NOTIFICATION_TO).subject,
  'Malone website contact: Local on-site IT support'
);
assertNoBooking(onsiteResponse, sent);

// Every built category must pass the actual backend validator, including exact U+2014.
for (const [index, category] of categories.entries()) {
  reset();
  const response = post(base({ category, email: `category-${index}@example.com` }));
  assert.equal(response.payload.ok, true, `Frontend category rejected by backend: ${category}`);
  assert.equal(sent.length, 2, `Frontend category did not send both messages: ${category}`);
}
assert.equal(categories[4].codePointAt(9), 0x2014, 'Approved uncertainty category lost its em dash.');

// Exact boundary acceptance and +1/minus-1 rejection without pre-validation truncation.
const maxEmail = `${'a'.repeat(242)}@example.com`;
const tooLongEmail = `${'a'.repeat(243)}@example.com`;
assert.equal(maxEmail.length, 254);
assert.equal(tooLongEmail.length, 255);

expectAccepted('minimum name length', { name: 'Al' });
expectAccepted('maximum name length', { name: 'N'.repeat(120) });
expectRejected('name below minimum', { name: 'N' }, 'Enter a valid name.');
expectRejected('name above maximum', { name: 'N'.repeat(121) }, 'Enter a valid name.');

expectAccepted('maximum email length', { email: maxEmail });
expectRejected('email above maximum', { email: tooLongEmail }, 'Enter a valid email address.');
expectRejected('malformed email', { email: 'not-an-email' }, 'Enter a valid email address.');

expectAccepted('empty optional organization', { organization: '' });
expectAccepted('maximum organization length', { organization: 'O'.repeat(160) });
expectRejected(
  'organization above maximum',
  { organization: 'O'.repeat(161) },
  'Keep the organization under 160 characters.'
);

expectAccepted('minimum message length', { message: 'M'.repeat(10) });
expectAccepted('maximum message length', { message: 'M'.repeat(5000) });
expectRejected(
  'message below minimum',
  { message: 'M'.repeat(9) },
  'The message must contain between 10 and 5000 characters.'
);
expectRejected(
  'message above maximum',
  { message: 'M'.repeat(5001) },
  'The message must contain between 10 and 5000 characters.'
);

expectAccepted('minimum request identifier length', { requestId: 'r'.repeat(16) });
expectAccepted('maximum request identifier length', { requestId: 'r'.repeat(80) });
expectRejected(
  'request identifier above maximum',
  { requestId: 'r'.repeat(81) },
  'The submission identifier is invalid. Please reload the page.'
);
expectRejected(
  'request identifier below minimum',
  { requestId: 'r'.repeat(15) },
  'The submission identifier is invalid. Please reload the page.'
);
expectRejected(
  'request identifier characters',
  { requestId: `${'r'.repeat(15)}_` },
  'The submission identifier is invalid. Please reload the page.'
);

expectAccepted('exact form identifier', { formId: 'malone-contact-v1' });
expectRejected(
  'form identifier mismatch',
  { formId: 'malone-contact-v1x' },
  'The contact form version is not recognized. Please reload the page.'
);
expectRejected(
  'form identifier above transport maximum',
  { formId: `malone-contact-v1${'x'.repeat(64)}` },
  'The contact form version is not recognized. Please reload the page.'
);
expectRejected(
  'missing privacy consent',
  { privacyConsent: '' },
  'Confirm the Privacy Policy notice before routing your message.'
);

expectAccepted('minimum form age', { formStartedAt: String(nowMs - 1500) });
expectAccepted('maximum form age', { formStartedAt: String(nowMs - 7200000) });
expectRejected(
  'form age below minimum',
  { formStartedAt: String(nowMs - 1499) },
  'The form session expired or completed too quickly. Please reload the page and try again.'
);
expectRejected(
  'form age above maximum',
  { formStartedAt: String(nowMs - 7200001) },
  'The form session expired or completed too quickly. Please reload the page and try again.'
);
expectRejected(
  'non-numeric form age',
  { formStartedAt: 'not-a-time' },
  'The form session expired or completed too quickly. Please reload the page and try again.'
);

expectRejected(
  'category suffix mismatch',
  { category: `${categories[4]}x` },
  'Choose a valid contact category.'
);

reset();
const unreadableResponse = postEvent(null);
assert.equal(unreadableResponse.payload.ok, false);
assert.equal(
  unreadableResponse.payload.message,
  'The submission was not readable. Please return to the form and try again.'
);
assert.equal(lockStats.gets, 0);

// Meeting backend contract and fail-closed malformed/missing configuration.
reset();
const meetingRequest = base({ category: 'Website help', meetingRequested: 'yes' });
const meetingResponse = post(meetingRequest);
assert.equal(meetingResponse.payload.ok, true);
assert.equal(meetingResponse.payload.bookingUrl, defaultProps.BOOKING_URL);
assert.equal(sent.length, 2, 'Meeting request must send both emails.');
const meetingOwner = sent.find((mail) => recipient(mail) === defaultProps.MALONE_NOTIFICATION_TO);
const meetingCustomer = sent.find((mail) => recipient(mail) === meetingRequest.email);
assert.equal(
  meetingOwner.subject,
  '[DISCOVERY MEETING REQUESTED] Malone website contact: Website help'
);
assert(/DISCOVERY MEETING REQUESTED/.test(mailContent(meetingOwner)));
assert(mailContent(meetingCustomer).includes(defaultProps.BOOKING_URL));
assertNoRecipientLeak(meetingResponse);

for (const bookingUrl of [
  '',
  'http://calendar.app.google/NOT-HTTPS',
  'https://calendar.app.google.evil.example/FAKE',
  'https://example.com/not-google-scheduling',
]) {
  reset();
  if (bookingUrl) props.BOOKING_URL = bookingUrl;
  else delete props.BOOKING_URL;
  const response = post(base({ meetingRequested: 'yes' }));
  assert.equal(response.payload.ok, false, `Malformed booking URL was accepted: ${bookingUrl}`);
  assert.equal(
    response.payload.message,
    'Online scheduling is being calibrated. Please uncheck the meeting request or use the direct email path.'
  );
  assert.equal(sent.length, 0);
  assert.equal(lockStats.gets, 0, 'Invalid meeting configuration reached locked state.');
  assertNoRecipientLeak(response);
}

reset();
props.MALONE_NOTIFICATION_TO = 'not-an-email';
const invalidRecipientResponse = post(base());
assert.equal(invalidRecipientResponse.payload.ok, false);
assert.equal(
  invalidRecipientResponse.payload.message,
  'Message routing is temporarily unavailable. Please use the direct email path.'
);
assert.equal(sent.length, 0);
assert.equal(lockStats.gets, 0);

// Honeypot is a safe success with no lock, state, or mail side effects.
reset();
const botRequest = base({ website: 'https://bot.example' });
const botResponse = post(botRequest);
assert.equal(botResponse.payload.ok, true);
assert.equal(sent.length, 0, 'Honeypot sent mail.');
assert.equal(cache.size, 0, 'Honeypot wrote cache state.');
assert.equal(lockStats.gets, 0, 'Honeypot unnecessarily acquired the script lock.');
assertNoRecipientLeak(botResponse);

// Lock contention fails closed before cache, quota, rate, or mail operations.
reset();
lockAvailable = false;
const busyResponse = post(base());
assert.equal(busyResponse.payload.ok, false);
assert.equal(
  busyResponse.payload.message,
  'The message channel is busy. Please wait a moment and try again.'
);
assert.equal(lockStats.gets, 1);
assert.equal(lockStats.tries, 1);
assert.equal(lockStats.releases, 0);
assert.equal(cacheServiceGets, 0);
assert.equal(quotaEvents.length, 0);
assert.equal(cache.size, 0);
assert.equal(sent.length, 0);

// Serial replay acquires one lock per request but never repeats mail or rate reservations.
reset();
const duplicateRequest = base();
const firstDuplicateResponse = post(duplicateRequest);
const secondDuplicateResponse = post(duplicateRequest);
assert.equal(firstDuplicateResponse.payload.ok, true);
assert.equal(secondDuplicateResponse.payload.ok, true);
assert.equal(sent.length, 2, 'Duplicate requestId sent duplicate mail.');
assert.equal(mailAttempts.length, 2, 'Duplicate requestId attempted duplicate mail.');
assert.equal(inboundRequests.length, 1, 'Duplicate requestId recorded a duplicate lead request.');
assert.equal(lockStats.gets, 2);
assert.equal(lockStats.releases, 2);
assert.equal(cache.get(requestKey(duplicateRequest)), 'complete');
const duplicateRateEntries = [...cache.entries()].filter(([key]) => key.startsWith('rate:'));
assert.equal(duplicateRateEntries.length, 2);
assert(duplicateRateEntries.every(([, value]) => value === '1'), 'Replay incremented rate counters.');

// A customer-mail failure preserves owner_sent and retries only the customer path.
reset();
const partialRequest = base({
  name: 'Partial Delivery Probe',
  email: 'partial-delivery@example.com',
  organization: 'Reliability Lab',
  message: 'Unique partial delivery content must never enter cache or logs.',
});
failRecipientOnce = partialRequest.email;
const partialFailure = post(partialRequest);
assert.equal(partialFailure.payload.ok, false);
assert.equal(
  partialFailure.payload.message,
  'The message could not be confirmed. Please try again or use the direct email path.'
);
assert.equal(sent.length, 1, 'Owner message should complete before simulated customer failure.');
assert.equal(sent[0].to, defaultProps.MALONE_NOTIFICATION_TO);
assert.equal(cache.get(requestKey(partialRequest)), 'owner_sent');
assert.equal(lockStats.releases, 1, 'Failure path leaked the script lock.');
quota = 1;
const partialRetry = post(partialRequest);
assert.equal(partialRetry.payload.ok, true, 'owner_sent retry did not complete with one mail quota.');
assert.equal(cache.get(requestKey(partialRequest)), 'complete');
assert.equal(sent.filter((mail) => mail.to === defaultProps.MALONE_NOTIFICATION_TO).length, 1);
assert.equal(sent.filter((mail) => mail.to === partialRequest.email).length, 1);
assert.equal(mailAttempts.filter((mail) => mail.to === defaultProps.MALONE_NOTIFICATION_TO).length, 1);
assert.equal(mailAttempts.filter((mail) => mail.to === partialRequest.email).length, 2);
assert.equal(inboundRequests.length, 1, 'Partial mail retry repeated the lead-ingress request.');
assert.equal(lockStats.gets, 2);
assert.equal(lockStats.releases, 2);
const partialRateEntries = [...cache.entries()].filter(([key]) => key.startsWith('rate:'));
assert(partialRateEntries.every(([, value]) => value === '1'), 'Partial retry incremented rate state.');
assertNoRawCacheOrLogs(partialRequest);

// Per-email and global throttles return their exact public-safe responses.
reset();
let perEmailResponse;
for (let index = 0; index < 4; index += 1) {
  perEmailResponse = post(base({
    requestId: crypto.randomUUID(),
    email: 'rate-probe@example.com',
  }));
}
assert.equal(sent.length, 6, 'Fourth per-email submission was not rate limited.');
assert.equal(perEmailResponse.payload.ok, false);
assert.equal(
  perEmailResponse.payload.message,
  'Please wait before sending another message from this email address.'
);
assertNoRecipientLeak(perEmailResponse);

reset();
let globalResponse;
for (let index = 0; index < 31; index += 1) {
  globalResponse = post(base({
    requestId: crypto.randomUUID(),
    email: `global-rate-${index}@example.com`,
  }));
}
assert.equal(sent.length, 60, 'Thirty-first global submission was not rate limited.');
assert.equal(globalResponse.payload.ok, false);
assert.equal(
  globalResponse.payload.message,
  'The message channel is receiving unusually high traffic. Please wait a moment and try again.'
);
assertNoRecipientLeak(globalResponse);

// Fresh submissions require two quota units and must not reserve rate state when quota is absent.
reset();
quota = 1;
const quotaResponse = post(base());
assert.equal(quotaResponse.payload.ok, false);
assert.equal(
  quotaResponse.payload.message,
  'The message channel has reached its daily limit. Please use the direct email path.'
);
assert.equal(sent.length, 0, 'Quota guard did not fail closed.');
assert.equal([...cache.keys()].filter((key) => key.startsWith('rate:')).length, 0);
assert.equal([...cache.keys()].filter((key) => key.startsWith('request:')).length, 0);
assert.equal(lockStats.releases, 1);
assertNoRecipientLeak(quotaResponse);

// The bridge remains independently switchable and preserves the existing mail path while disabled.
reset();
props.MALONE_INBOUND_LEAD_BRIDGE_ENABLED = 'false';
const disabledBridgeResponse = post(base());
assert.equal(disabledBridgeResponse.payload.ok, true);
assert.equal(inboundRequests.length, 0);
assert.equal(sent.length, 2);

// Enabled bridge configuration and receipt mismatches fail closed before mail is sent.
reset();
delete props.MALONE_INBOUND_LEAD_HMAC_SECRET;
const missingBridgeSecretResponse = post(base());
assert.equal(missingBridgeSecretResponse.payload.ok, false);
assert.equal(sent.length, 0);
assert.equal(inboundRequests.length, 0);

reset();
inboundResponseOverride = {
  state: 'RECORDED',
  contractVersion: 'mit-inbound-lead-v1',
  data: { requestId: 'different-request-id', status: 'new', idempotentReplay: false },
};
const mismatchedBridgeResponse = post(base());
assert.equal(mismatchedBridgeResponse.payload.ok, false);
assert.equal(inboundRequests.length, 1);
assert.equal(sent.length, 0);
assert.equal([...cache.keys()].filter((key) => key.startsWith('request:')).length, 0);

process.stdout.write(JSON.stringify({
  status: 'PASS',
  categoriesTested: categories.length,
  exactBoundaries: true,
  overlimitsRejectedWithoutTruncation: true,
  healthAndOriginFallbacks: true,
  responseCspAndScriptEscaping: true,
  completeMailContract: true,
  htmlEscaping: true,
  meetingPath: true,
  meetingDisabledFailClosed: true,
  honeypot: true,
  singleLockStateAndMail: true,
  lockBusyFailClosed: true,
  serialReplay: true,
  partialDeliveryRetry: true,
  perEmailRateLimit: true,
  globalRateLimit: true,
  quotaGuard: true,
  rawCacheOrLogs: false,
  structuredLeadBridge: true,
  hmacContract: true,
  bridgeDisabledPreservesMail: true,
  bridgeReceiptMismatchFailsClosed: true,
  privateRecipientExposed: false,
}, null, 2));
