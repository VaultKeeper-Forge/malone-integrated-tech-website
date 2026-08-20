const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const vm = require('node:vm');

const [codePath, htmlPath] = process.argv.slice(2);
const source = fs.readFileSync(codePath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');
const cache = new Map();
const sent = [];
const logs = [];
let quota = 1000;
const props = {
  MALONE_NOTIFICATION_TO: 'curtis@maloneintegratedtech.com',
  ALLOWED_ORIGIN: 'https://www.maloneintegratedtech.com',
  BOOKING_URL: 'https://calendar.app.google/TEST-MALONE-BOOKING',
};
const cacheApi = () => ({
  get: (key) => cache.has(key) ? cache.get(key) : null,
  put: (key, value) => cache.set(key, String(value)),
  remove: (key) => cache.delete(key),
});
const normalizeMail = (args) => args.length === 1 && typeof args[0] === 'object'
  ? { ...args[0] }
  : { to: args[0], subject: args[1], body: args[2], ...(args[3] || {}) };

const context = {
  CacheService: { getScriptCache: cacheApi },
  LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
  PropertiesService: { getScriptProperties: () => ({
    getProperty: (key) => props[key] ?? null,
  }) },
  MailApp: {
    getRemainingDailyQuota: () => quota,
    sendEmail: (...args) => sent.push(normalizeMail(args)),
  },
  HtmlService: {
    XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' },
    createHtmlOutput: (value) => ({
      value: String(value),
      setTitle() { return this; },
      setXFrameOptionsMode() { return this; },
      getContent() { return this.value; },
    }),
  },
  Utilities: {
    Charset: { UTF_8: 'UTF_8' },
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    formatDate: (date) => new Date(date).toISOString(),
    computeDigest: (_algorithm, value) => [...crypto.createHash('sha256').update(String(value)).digest()],
  },
  Session: { getScriptTimeZone: () => 'America/Los_Angeles' },
  console: {
    log: (...args) => logs.push(['log', ...args]),
    warn: (...args) => logs.push(['warn', ...args]),
    error: (...args) => logs.push(['error', ...args]),
  },
  Date, JSON, Math, Number, Object, RegExp, String, Array, Boolean, Error,
};
vm.createContext(context);
vm.runInContext(source, context, { filename: codePath });
assert.equal(typeof context.doPost, 'function', 'Code.gs must expose doPost.');

const categoryBlock = html.match(/<select[^>]*name="category"[^>]*>[\s\S]*?<\/select>/i);
assert(categoryBlock, 'Built form must contain category selector.');
const categories = [...categoryBlock[0].matchAll(/<option[^>]*value="([^"]+)"/gi)]
  .map((match) => match[1].trim()).filter(Boolean);
assert(categories.length > 0, 'Built form must expose categories.');
for (const field of ['name','email','organization','category','message','website','formId','requestId','formStartedAt','meetingRequested']) {
  assert(html.includes(`name="${field}"`), `Built form missing ${field}.`);
}

function reset() {
  cache.clear();
  sent.length = 0;
  logs.length = 0;
  quota = 1000;
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
    formStartedAt: String(Date.now() - 5000),
    ...overrides,
  };
}
function post(parameters) {
  const result = context.doPost({ parameter: parameters });
  assert(result && typeof result.getContent === 'function', 'doPost must return HtmlOutput.');
  return result.getContent();
}
const recipient = (mail) => String(mail.to || '');
const content = (mail) => `${mail.subject || ''}\n${mail.body || ''}\n${mail.htmlBody || ''}`;
const noLeak = (response) => assert(!response.includes(props.MALONE_NOTIFICATION_TO), 'Response leaked private recipient.');

reset();
const normalResponse = post(base());
assert.equal(sent.length, 2, 'Valid submission must send exactly two emails.');
const owner = sent.find((mail) => recipient(mail) === props.MALONE_NOTIFICATION_TO);
const customer = sent.find((mail) => recipient(mail) === 'external.test@example.com');
assert(owner && customer, 'Owner and customer mail paths must both run.');
assert.equal(owner.replyTo, 'external.test@example.com', 'Owner replyTo must be sender.');
assert(content(owner).includes('This complete message must appear'), 'Owner mail omitted complete message.');
assert(content(customer).includes('This complete message must appear'), 'Customer copy omitted complete message.');
assert(!String(customer.cc || '').includes(props.MALONE_NOTIFICATION_TO), 'Customer CC exposed owner.');
assert(!String(customer.bcc || '').includes(props.MALONE_NOTIFICATION_TO), 'Customer BCC exposed owner.');
noLeak(normalResponse);

for (const [index, category] of categories.entries()) {
  reset();
  post(base({ category, email: `category-${index}@example.com` }));
  assert.equal(sent.length, 2, `Frontend category rejected by backend: ${category}`);
}

reset();
const meetingResponse = post(base({ meetingRequested: 'yes' }));
assert.equal(sent.length, 2, 'Meeting request must send both emails.');
const meetingOwner = sent.find((mail) => recipient(mail) === props.MALONE_NOTIFICATION_TO);
const meetingCustomer = sent.find((mail) => recipient(mail) === 'external.test@example.com');
assert(/DISCOVERY MEETING REQUESTED/i.test(content(meetingOwner)), 'Owner mail did not mark meeting request.');
assert(content(meetingCustomer).includes(props.BOOKING_URL), 'Customer mail omitted booking URL.');
assert(meetingResponse.includes(props.BOOKING_URL), 'Success response omitted booking URL.');
noLeak(meetingResponse);

for (const bad of [
  { name: '' },
  { email: 'not-an-email' },
  { category: 'Unapproved category' },
  { message: '' },
  { formStartedAt: String(Date.now()) },
]) {
  reset();
  const response = post(base(bad));
  assert.equal(sent.length, 0, `Malformed input sent mail: ${JSON.stringify(bad)}`);
  noLeak(response);
}

reset();
const botResponse = post(base({ website: 'https://bot.example' }));
assert.equal(sent.length, 0, 'Honeypot sent mail.');
noLeak(botResponse);

reset();
const duplicate = base();
post(duplicate);
post(duplicate);
assert.equal(sent.length, 2, 'Duplicate requestId sent duplicate mail.');

reset();
for (let index = 0; index < 4; index += 1) {
  post(base({ requestId: crypto.randomUUID() }));
}
assert.equal(sent.length, 6, 'Fourth rapid submission was not rate limited.');

reset();
quota = 1;
post(base());
assert.equal(sent.length, 0, 'Quota guard did not fail closed.');
assert.equal(logs.length, 0, 'Backend logged submission or error data.');

process.stdout.write(JSON.stringify({
  status: 'PASS',
  categoriesTested: categories.length,
  mailIsolation: true,
  meetingPath: true,
  malformedInput: true,
  honeypot: true,
  idempotency: true,
  rateLimit: true,
  quotaGuard: true,
  privateRecipientExposed: false
}, null, 2));
