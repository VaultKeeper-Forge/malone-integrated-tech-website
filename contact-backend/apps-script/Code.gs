const MALONE_CONTACT_CONFIG = Object.freeze({
  formId: 'malone-contact-v1',
  notificationTo: 'curtis@maloneintegratedtech.com',
  allowedCategories: Object.freeze([
    'Integrated assistant systems',
    'Business systems',
    'Tool integration',
    'Data and continuity',
    'Applied AI and R&D',
    'Something else'
  ]),
  maxGlobalPerMinute: 30,
  maxPerEmailPerTenMinutes: 3,
  minimumFormAgeMs: 1500,
  maximumFormAgeMs: 7200000,
  requestStateSeconds: 900
});

function doGet() {
  return contactResponse_({
    type: 'malone-contact-health',
    ok: true,
    status: 'ready'
  });
}

function doPost(e) {
  const submittedAt = new Date();
  let requestId = '';

  try {
    if (!e || !e.parameter) {
      return contactError_('The submission was not readable. Please return to the form and try again.', requestId);
    }

    const payload = normalizePayload_(e.parameter);
    requestId = payload.requestId;
    if (payload.website) {
      return contactSuccess_('', requestId);
    }

    const validation = validatePayload_(payload, submittedAt);
    if (!validation.ok) {
      return contactError_(validation.message, requestId);
    }

    const properties = PropertiesService.getScriptProperties();
    const notificationTo = normalizeEmail_(
      properties.getProperty('MALONE_NOTIFICATION_TO') || MALONE_CONTACT_CONFIG.notificationTo
    );
    const bookingUrl = normalizeUrl_(properties.getProperty('BOOKING_URL') || '');

    if (!isEmail_(notificationTo)) {
      return contactError_('Message routing is temporarily unavailable. Please use the direct email path.', requestId);
    }

    if (payload.meetingRequested && !isGoogleBookingUrl_(bookingUrl)) {
      return contactError_('Online scheduling is being calibrated. Please uncheck the meeting request or use the direct email path.', requestId);
    }

    const cache = CacheService.getScriptCache();
    const requestKey = 'request:' + payload.requestId;
    const existingState = cache.get(requestKey);

    if (existingState === 'complete') {
      return contactSuccess_(payload.meetingRequested ? bookingUrl : '', requestId);
    }

    if (!existingState) {
      const rateResult = reserveRateLimit_(payload.email);
      if (!rateResult.ok) {
        return contactError_(rateResult.message, requestId);
      }
    }

    if (MailApp.getRemainingDailyQuota() < 2) {
      return contactError_('The message channel has reached its daily limit. Please use the direct email path.', requestId);
    }

    if (existingState !== 'owner_sent') {
      sendMaloneNotification_(payload, submittedAt, notificationTo);
      cache.put(requestKey, 'owner_sent', MALONE_CONTACT_CONFIG.requestStateSeconds);
    }

    sendCustomerConfirmation_(payload, submittedAt, notificationTo, bookingUrl);
    cache.put(requestKey, 'complete', MALONE_CONTACT_CONFIG.requestStateSeconds);

    return contactSuccess_(payload.meetingRequested ? bookingUrl : '', requestId);
  } catch (error) {
    return contactError_('The message could not be confirmed. Please try again or use the direct email path.', requestId);
  }
}

function normalizePayload_(parameters) {
  return {
    formId: safeText_(parameters.formId, 80),
    requestId: safeText_(parameters.requestId, 80),
    formStartedAt: Number(parameters.formStartedAt || 0),
    website: safeText_(parameters.website, 200),
    name: safeText_(parameters.name, 120),
    email: normalizeEmail_(parameters.email),
    organization: safeText_(parameters.organization, 160),
    category: safeText_(parameters.category, 80),
    message: safeMultiline_(parameters.message, 5000),
    meetingRequested: String(parameters.meetingRequested || '').toLowerCase() === 'yes'
  };
}

function validatePayload_(payload, submittedAt) {
  if (payload.formId !== MALONE_CONTACT_CONFIG.formId) {
    return invalid_('The contact form version is not recognized. Please reload the page.');
  }

  if (!/^[A-Za-z0-9-]{16,80}$/.test(payload.requestId)) {
    return invalid_('The submission identifier is invalid. Please reload the page.');
  }

  const formAge = submittedAt.getTime() - payload.formStartedAt;
  if (
    !Number.isFinite(formAge) ||
    formAge < MALONE_CONTACT_CONFIG.minimumFormAgeMs ||
    formAge > MALONE_CONTACT_CONFIG.maximumFormAgeMs
  ) {
    return invalid_('The form session expired or completed too quickly. Please reload the page and try again.');
  }

  if (payload.name.length < 2 || payload.name.length > 120) {
    return invalid_('Enter a valid name.');
  }

  if (!isEmail_(payload.email)) {
    return invalid_('Enter a valid email address.');
  }

  if (payload.organization.length > 160) {
    return invalid_('Keep the organization under 160 characters.');
  }

  if (MALONE_CONTACT_CONFIG.allowedCategories.indexOf(payload.category) === -1) {
    return invalid_('Choose a valid contact category.');
  }

  if (payload.message.length < 10 || payload.message.length > 5000) {
    return invalid_('The message must contain between 10 and 5000 characters.');
  }

  return { ok: true };
}

function invalid_(message) {
  return { ok: false, message: message };
}

function reserveRateLimit_(email) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1500)) {
    return invalid_('The message channel is busy. Please wait a moment and try again.');
  }

  try {
    const cache = CacheService.getScriptCache();
    const minuteBucket = Math.floor(Date.now() / 60000);
    const globalKey = 'rate:global:' + minuteBucket;
    const emailKey = 'rate:email:' + hash_(email);
    const globalCount = Number(cache.get(globalKey) || 0);
    const emailCount = Number(cache.get(emailKey) || 0);

    if (globalCount >= MALONE_CONTACT_CONFIG.maxGlobalPerMinute) {
      return invalid_('The message channel is receiving unusually high traffic. Please wait a moment and try again.');
    }

    if (emailCount >= MALONE_CONTACT_CONFIG.maxPerEmailPerTenMinutes) {
      return invalid_('Please wait before sending another message from this email address.');
    }

    cache.put(globalKey, String(globalCount + 1), 90);
    cache.put(emailKey, String(emailCount + 1), 600);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function sendMaloneNotification_(payload, submittedAt, notificationTo) {
  const meetingLabel = payload.meetingRequested ? 'YES - DISCOVERY MEETING REQUESTED' : 'No';
  const subjectPrefix = payload.meetingRequested ? '[DISCOVERY MEETING REQUESTED] ' : '';
  const subject = subjectPrefix + 'Malone website contact: ' + payload.category;
  const timestamp = formatTimestamp_(submittedAt);
  const body = [
    payload.meetingRequested ? 'DISCOVERY MEETING REQUESTED' : 'NEW MALONE CONTACT',
    '',
    'Sender name: ' + payload.name,
    'Sender email: ' + payload.email,
    'Organization: ' + (payload.organization || 'Not provided'),
    'Category: ' + payload.category,
    'Online meeting requested: ' + meetingLabel,
    'Submission timestamp: ' + timestamp,
    '',
    'MESSAGE',
    '-------',
    payload.message
  ].join('\n');

  MailApp.sendEmail({
    to: notificationTo,
    replyTo: payload.email,
    name: 'Malone Contact Desk',
    subject: subject,
    body: body,
    htmlBody: buildMaloneHtml_(payload, timestamp, meetingLabel)
  });
}
function sendCustomerConfirmation_(payload, submittedAt, notificationTo, bookingUrl) {
  const timestamp = formatTimestamp_(submittedAt);
  const meetingLines = payload.meetingRequested
    ? [
        '',
        'You asked to schedule an online discovery meeting.',
        'Choose an available time here:',
        bookingUrl
      ]
    : [];

  const body = [
    'We received your message. Here is a copy for your records.',
    '',
    'Name: ' + payload.name,
    'Email: ' + payload.email,
    'Organization: ' + (payload.organization || 'Not provided'),
    'Category: ' + payload.category,
    'Submitted: ' + timestamp,
    '',
    'YOUR MESSAGE',
    '------------',
    payload.message
  ].concat(meetingLines).concat([
    '',
    'Malone Integrated Tech',
    'https://www.maloneintegratedtech.com/contact'
  ]).join('\n');

  MailApp.sendEmail({
    to: payload.email,
    replyTo: notificationTo,
    name: 'Malone Integrated Tech',
    subject: 'We received your message | Malone Integrated Tech',
    body: body,
    htmlBody: buildCustomerHtml_(payload, timestamp, bookingUrl)
  });
}

function buildMaloneHtml_(payload, timestamp, meetingLabel) {
  return [
    '<div style="font-family:Arial,sans-serif;background:#0a0c10;color:#f2f4f7;padding:28px">',
    '<div style="max-width:680px;margin:auto;border:1px solid #33404f;padding:28px">',
    '<p style="color:#62a7ff;letter-spacing:.12em;text-transform:uppercase;font-size:12px;margin:0 0 10px">',
    payload.meetingRequested ? 'DISCOVERY MEETING REQUESTED' : 'NEW MALONE CONTACT',
    '</p>',
    '<h1 style="font-size:26px;margin:0 0 24px">', escapeHtml_(payload.category), '</h1>',
    '<table style="width:100%;border-collapse:collapse;color:#c7ccd4;font-size:14px">',
    emailRow_('Sender name', payload.name),
    emailRow_('Sender email', payload.email),
    emailRow_('Organization', payload.organization || 'Not provided'),
    emailRow_('Meeting requested', meetingLabel),
    emailRow_('Submitted', timestamp),
    '</table>',
    '<h2 style="font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:#62a7ff;margin:28px 0 10px">Message</h2>',
    '<div style="white-space:pre-wrap;line-height:1.65;color:#f2f4f7;border-left:2px solid #1e7bff;padding-left:16px">',
    escapeHtml_(payload.message),
    '</div></div></div>'
  ].join('');
}

function buildCustomerHtml_(payload, timestamp, bookingUrl) {
  const booking = payload.meetingRequested && bookingUrl
    ? [
        '<div style="margin-top:26px;padding:20px;border:1px solid #1e7bff;background:#0d1623">',
        '<p style="margin:0 0 14px;color:#f2f4f7">You asked to schedule an online discovery meeting.</p>',
        '<a href="', escapeHtml_(bookingUrl), '" style="display:inline-block;background:#1e7bff;color:white;text-decoration:none;padding:13px 18px;font-weight:bold">',
        'Schedule your discovery meeting</a></div>'
      ].join('')
    : '';

  return [
    '<div style="font-family:Arial,sans-serif;background:#0a0c10;color:#f2f4f7;padding:28px">',
    '<div style="max-width:680px;margin:auto;border:1px solid #33404f;padding:28px">',
    '<p style="color:#62a7ff;letter-spacing:.12em;text-transform:uppercase;font-size:12px;margin:0 0 10px">Message confirmed</p>',
    '<h1 style="font-size:27px;margin:0 0 14px">We received your message.</h1>',
    '<p style="color:#c7ccd4;line-height:1.6">Here is a copy for your records.</p>',
    '<p style="color:#87919e;font-size:13px">Submitted ', escapeHtml_(timestamp), '</p>',
    '<div style="margin-top:24px;padding:18px;border-left:2px solid #1e7bff;background:#0d1117">',
    '<p style="margin:0 0 8px;color:#87919e;font-size:12px;text-transform:uppercase;letter-spacing:.1em">',
    escapeHtml_(payload.category), '</p>',
    '<div style="white-space:pre-wrap;line-height:1.65;color:#f2f4f7">', escapeHtml_(payload.message), '</div>',
    '</div>', booking,
    '<p style="margin-top:28px;color:#87919e;font-size:13px">Malone Integrated Tech<br>',
    '<a href="https://www.maloneintegratedtech.com/contact" style="color:#62a7ff">www.maloneintegratedtech.com/contact</a></p>',
    '</div></div>'
  ].join('');
}

function emailRow_(label, value) {
  return [
    '<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #27303a;color:#87919e;width:36%">',
    escapeHtml_(label),
    '</td><td style="padding:8px 0;border-bottom:1px solid #27303a;color:#f2f4f7">',
    escapeHtml_(value),
    '</td></tr>'
  ].join('');
}

function contactSuccess_(bookingUrl, requestId) {
  const response = {
    type: 'malone-contact-result',
    requestId: requestId,
    ok: true,
    message: 'Message confirmed.'
  };
  if (bookingUrl) response.bookingUrl = bookingUrl;
  return contactResponse_(response);
}

function contactError_(message, requestId) {
  return contactResponse_({
    type: 'malone-contact-result',
    requestId: requestId,
    ok: false,
    message: message
  });
}

function contactResponse_(payload) {
  const allowedOrigin = getAllowedOrigin_();
  const serialized = JSON.stringify(payload).replace(/</g, '\\u003c');
  const origin = JSON.stringify(allowedOrigin);
  const html = [
    '<!doctype html><html><head><meta charset="utf-8">',
    '<meta http-equiv="Content-Security-Policy" content="default-src &apos;none&apos;; script-src &apos;unsafe-inline&apos;">',
    '<title>Malone Contact Desk</title></head><body>',
    '<script>window.top.postMessage(', serialized, ',', origin, ');</script>',
    '</body></html>'
  ].join('');

  return HtmlService.createHtmlOutput(html)
    .setTitle('Malone Contact Desk')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getAllowedOrigin_() {
  const configured = String(
    PropertiesService.getScriptProperties().getProperty('ALLOWED_ORIGIN') ||
    'https://www.maloneintegratedtech.com'
  ).trim();

  if (
    configured === 'https://www.maloneintegratedtech.com' ||
    /^http:\/\/localhost:\d+$/.test(configured)
  ) {
    return configured;
  }

  return 'https://www.maloneintegratedtech.com';
}

function formatTimestamp_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss z');
}

function normalizeEmail_(value) {
  return safeText_(value, 254).toLowerCase();
}

function normalizeUrl_(value) {
  return safeText_(value, 1000);
}

function safeText_(value, maxLength) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function safeMultiline_(value, maxLength) {
  return String(value || '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .slice(0, maxLength);
}

function isEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

function isGoogleBookingUrl_(value) {
  return /^https:\/\/(?:calendar\.app\.google|calendar\.google\.com|[A-Za-z0-9.-]+\.google\.com)\//i.test(value);
}

function hash_(value) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8
  );
  return digest.map(function(byte) {
    const normalized = byte < 0 ? byte + 256 : byte;
    return ('0' + normalized.toString(16)).slice(-2);
  }).join('');
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
