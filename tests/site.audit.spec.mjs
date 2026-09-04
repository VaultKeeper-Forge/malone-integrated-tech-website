import { test, expect } from '@playwright/test';
import path from 'node:path';

const routes = ['/', '/services', '/research', '/projects', '/contact'];
const productionOrigin = 'https://www.maloneintegratedtech.com';
const screenshotRoot = process.env.MALONE_SCREENSHOT_DIR || 'C:/tmp/malone-site-screenshots';
const mockContact = process.env.CONTACT_MODE === 'mock';
const localOrigin = new URL(process.env.SITE_BASE_URL || 'http://127.0.0.1:4334').origin;

function observe(page) {
  const faults = [];
  const assetTypes = new Set(['stylesheet', 'script', 'image', 'font']);
  page.on('console', (message) => {
    if (message.type() === 'error') faults.push('console: ' + message.text());
  });
  page.on('pageerror', (error) => faults.push('page: ' + error.message));
  page.on('requestfailed', (request) => {
    if (assetTypes.has(request.resourceType())) {
      faults.push('requestfailed: ' + request.url() + ' ' +
        (request.failure()?.errorText || 'unknown failure'));
    }
  });
  page.on('response', (response) => {
    if (assetTypes.has(response.request().resourceType()) && response.status() >= 400) {
      faults.push('asset: ' + response.status() + ' ' + response.url());
    }
  });
  return faults;
}

async function mockContactPost(page, options = {}) {
  const requests = [];
  let releaseHold;
  const holdGate = options.hold
    ? new Promise((resolve) => { releaseHold = resolve; })
    : null;

  if (!mockContact) return;
  await page.route('https://script.google.com/macros/s/**/exec', async (route) => {
    const raw = route.request().postData() || '';
    const data = new URLSearchParams(raw);
    requests.push({ raw, data: Object.fromEntries(data.entries()) });

    if (holdGate) await holdGate;
    if (options.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, options.delayMs));
    }
    if (options.mode === 'no-callback') {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><title>Contact response intentionally omitted</title>'
      });
      return;
    }

    const ok = options.mode !== 'error';
    const bookingUrl = options.bookingUrl ?? (
      data.get('meetingRequested') === 'yes'
        ? 'https://calendar.app.google/TEST-MALONE-BOOKING'
        : ''
    );
    const payload = {
      type: 'malone-contact-result',
      ok,
      requestId: String(data.get('requestId') || ''),
      message: ok ? 'Message confirmed.' : (options.errorMessage || 'Synthetic recoverable error.'),
      ...(ok && bookingUrl ? { bookingUrl } : {})
    };
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><script>window.top.postMessage(' +
        JSON.stringify(payload) + ',' + JSON.stringify(localOrigin) + ')</script>'
    });
  });

  return {
    requests,
    release() {
      releaseHold?.();
    }
  };
}

async function fillContactForm(page, overrides = {}) {
  const values = {
    name: 'Contact Desk Verification',
    email: 'external.test@example.com',
    organization: '',
    category: 'Not sure — help me figure it out',
    message: 'This is a complete Contact Desk acceptance message.',
    ...overrides
  };
  await page.getByRole('textbox', { name: /^Name Required/ }).fill(values.name);
  await page.getByRole('textbox', { name: /^Email Required/ }).fill(values.email);
  await page.getByRole('textbox', { name: /Business \/ organization/i })
    .fill(values.organization);
  await page.getByRole('combobox', { name: /What can we help with/i })
    .selectOption({ label: values.category });
  await page.getByRole('textbox', { name: /Message \/ question/i }).fill(values.message);
  return values;
}

test.describe('Malone consumer surface', () => {
  for (const route of routes) {
    test(route + ' route, links, metadata, visuals', async ({ page, request }, testInfo) => {
      const faults = observe(page);
      await mockContactPost(page);
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response).not.toBeNull();
      expect(response.status()).toBeLessThan(400);
      await expect(page.locator('.site-shell main h1')).toHaveCount(1);
      await expect(page.locator('body')).not.toContainText(
        /Calibration Mark|Geometric M with open corners|frame-path note|model thought|Spark Mini/i
      );

      const metadata = await page.evaluate(() => {
        const meta = (selector) =>
          document.querySelector(selector)?.getAttribute('content') || '';
        return {
          title: document.title,
          description: meta('meta[name="description"]'),
          robots: meta('meta[name="robots"]'),
          canonical: document.querySelector('link[rel="canonical"]')?.href || '',
          ogUrl: meta('meta[property="og:url"]'),
          ogImage: meta('meta[property="og:image"]'),
          twitterCard: meta('meta[name="twitter:card"]'),
          jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')]
            .map((script) => JSON.parse(script.textContent || '{}'))
        };
      });

      expect(metadata.title.length).toBeGreaterThan(20);
      expect(metadata.title.length).toBeLessThan(70);
      expect(metadata.description.length).toBeGreaterThan(80);
      expect(metadata.description.length).toBeLessThan(180);
      expect(metadata.robots).toContain('max-image-preview:large');
      expect(metadata.canonical).toBe(productionOrigin + (route === '/' ? '/' : route));
      expect(metadata.ogUrl).toBe(metadata.canonical);
      expect(metadata.ogImage.startsWith(productionOrigin + '/brand/')).toBeTruthy();
      expect(metadata.ogImage.endsWith('.png')).toBeTruthy();
      expect(metadata.twitterCard).toBe('summary_large_image');
      const graph = metadata.jsonLd.flatMap((entry) => entry['@graph'] || []);
      expect(graph.some((entry) => entry['@type'] === 'Organization')).toBeTruthy();
      expect(graph.some((entry) => entry['@type'] === 'WebSite')).toBeTruthy();
      expect(graph.some((entry) => entry.url === metadata.canonical)).toBeTruthy();

      await page.locator('img[loading="lazy"]').evaluateAll((images) => {
        images.forEach((image) => {
          image.loading = 'eager';
        });
      });
      await page.waitForFunction(() => [...document.images]
        .filter((image) => image.loading === 'lazy')
        .every((image) => image.complete));

      const brokenImages = await page.evaluate(() => [...document.images]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src || image.alt));
      expect(brokenImages).toEqual([]);

      const hrefs = await page.locator('a[href]').evaluateAll((links) =>
        [...new Set(links.map((link) => link.getAttribute('href')).filter(Boolean))]
      );
      for (const href of hrefs) {
        if (href.startsWith('mailto:')) {
          expect(href).toContain('curtis@maloneintegratedtech.com');
          continue;
        }
        if (/^(tel:|javascript:)/.test(href)) continue;
        const url = new URL(href, page.url());
        if (url.origin !== new URL(page.url()).origin) continue;
        const check = await request.get(url.origin + url.pathname + url.search);
        expect(check.status(), 'Broken link ' + href).toBeLessThan(400);
        if (url.hash) {
          const id = decodeURIComponent(url.hash.slice(1));
          const current = new URL(page.url());
          const found = url.pathname === current.pathname
            ? await page.evaluate((target) => Boolean(document.getElementById(target)), id)
            : (await check.text()).includes("id=\"" + id + "\"");
          expect(found, 'Missing hash target ' + href).toBeTruthy();
        }
      }

      const visual = await page.evaluate(async () => {
        const primary = [...document.querySelectorAll('main section, main article, main form')]
          .filter((element) => !element.hidden && getComputedStyle(element).display !== 'none')
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { left: rect.left, right: rect.right, width: rect.width };
          });
        const maxScroll = document.documentElement.scrollHeight - innerHeight;
        const increment = Math.max(320, Math.floor(innerHeight * .65));
        for (let top = 0; top <= maxScroll; top += increment) {
          window.scrollTo(0, top);
          await new Promise((resolve) => setTimeout(resolve, 160));
        }
        window.scrollTo(0, maxScroll);
        await new Promise((resolve) => setTimeout(resolve, 800));
        return {
          viewport: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
          primary,
          moving: [...document.querySelectorAll('body *')].filter((element) => {
            const style = getComputedStyle(element);
            return style.animationName !== 'none' ||
              style.transitionDuration.split(',').some((value) => parseFloat(value) > 0.15);
          }).length
        };
      });

      expect(visual.scrollWidth).toBeLessThanOrEqual(visual.viewport + 1);
      expect(visual.scrollHeight).toBeGreaterThan(800);
      expect(visual.moving).toBeGreaterThan(0);
      if (route === '/') {
        expect(await page.locator('.motion-ready .reveal:not(.reveal-visible)').count()).toBe(0);
      }
      for (const region of visual.primary) {
        expect(region.width).toBeGreaterThan(0);
        expect(region.left).toBeGreaterThanOrEqual(-2);
        expect(region.right).toBeLessThanOrEqual(visual.viewport + 2);
      }

      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
      });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.waitForTimeout(200);

      const name = testInfo.project.name + '-pass-' +
        (testInfo.repeatEachIndex + 1) + '-' +
        (route === '/' ? 'home' : route.slice(1)) + '.png';
      await page.screenshot({
        path: path.join(screenshotRoot, name),
        fullPage: true,
        animations: 'allow'
      });
      expect(faults).toEqual([]);
    });
  }

  test('services publish clear prices without internal quote controls', async ({ page }) => {
    const faults = observe(page);
    await page.goto('/services', { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Useful systems, clearly scoped.'
    );
    await expect(page.locator('[data-service-offer]')).toHaveCount(15);
    await expect(page.locator('[data-care-plan]')).toHaveCount(3);
    await expect(page.locator('[data-service-offer="local-onsite-it-support"]'))
      .toContainText('$125 first hour');
    await expect(page.locator('[data-service-offer="systems-map"]')).toContainText('$250');
    await expect(page.locator('[data-service-offer="systems-troubleshooting-session"]'))
      .toContainText('Systems Troubleshooting Session');
    await expect(
      page.locator('[data-service-offer="connected-business-website"]')
    ).toContainText('$2,500');
    await expect(
      page.locator('[data-service-offer="managed-operations-system"]')
    ).toContainText('$5,000–$10,000');
    await expect(page.locator('[data-care-plan="site-care"]')).toContainText('$100 / month');
    await expect(page.getByRole('link', { name: /request a fit check/i })).toHaveAttribute(
      'href',
      '/contact'
    );
    await expect(page.getByRole('link', { name: /request a local appointment/i }))
      .toHaveAttribute('href', '/contact?category=local-onsite-support');
    await expect(page.locator('body')).not.toContainText('Rescue Session');
    await expect(page.locator('body')).not.toContainText(
      /internal floor|target margin|discount cap|labor cost|estimated hours/i
    );

    const services = await page.evaluate(() => {
      const graph = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .flatMap((script) => JSON.parse(script.textContent || '{}')['@graph'] || []);
      const itemList = graph.find((entry) => entry['@id']?.endsWith('#services'));
      return itemList?.itemListElement?.map((entry) => entry.item) || [];
    });
    expect(services).toHaveLength(18);
    expect(services.find((service) => service.name === 'Business Systems Map')?.offers?.price)
      .toBe(250);
    expect(
      services.find((service) => service.name === 'Managed Operations System')?.offers?.lowPrice
    ).toBe(5000);
    expect(faults).toEqual([]);
  });

  test('local support routes into an appointment-specific intake', async ({ page }) => {
    const faults = observe(page);
    await page.goto('/services', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: /request a local appointment/i }).click();
    await expect(page).toHaveURL(/\/contact\?category=local-onsite-support$/);
    await expect(page.locator('select[name="category"]')).toHaveValue('Local on-site IT support');
    await expect(page.locator('[data-local-appointment-note]')).toBeVisible();
    await expect(page.locator('[data-local-appointment-note]')).toContainText(
      'Malone will confirm the service area, any travel charge, and an available arrival window'
    );
    await expect(page.locator('[data-meeting-option]')).toBeHidden();
    await expect(page.locator('textarea[name="message"]')).toHaveAttribute(
      'placeholder',
      /town or ZIP code/
    );
    expect(faults).toEqual([]);
  });

  test('primary navigation and home scroll links click through', async ({ page, context }, info) => {
    test.skip(!info.project.name.startsWith('desktop'), 'Desktop interaction matrix.');
    const faults = observe(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    for (const href of ['/services', '/research', '/projects', '/contact']) {
      const probe = await context.newPage();
      const probeFaults = observe(probe);
      await probe.goto('/');
      const link = probe.locator('a[href="' + href + '"]:visible').first();
      await expect(link).toBeVisible();
      await link.click();
      await expect(probe).toHaveURL(new RegExp(href + '/?$'));
      expect(probeFaults).toEqual([]);
      await probe.close();
    }

    const hashes = await page.locator('a[href^="#"]').evaluateAll((links) =>
      [...new Set(links.map((link) => link.getAttribute('href'))
        .filter((href) => href && href.length > 1))]
    );
    for (const href of hashes) {
      await page.goto('/');
      await page.locator('a[href="' + href + '"]:visible').first().click();
      await expect.poll(() => page.evaluate(() => location.hash)).toBe(href);
      await expect.poll(() => page.locator(href).evaluate(
        (element) => Math.abs(element.getBoundingClientRect().top)
      )).toBeLessThan(page.viewportSize().height);
    }
    expect(faults).toEqual([]);
  });

  test('mobile menu opens and routes to contact', async ({ page }, info) => {
    test.skip(!info.project.name.startsWith('mobile'), 'Mobile interaction matrix.');
    const faults = observe(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    const toggle = page.locator('[role="button"][aria-controls]').first();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.locator('a[href="/contact"]:visible').first().click();
    await expect(page).toHaveURL(new RegExp('/contact/?$'));
    expect(faults).toEqual([]);
  });

  test('contact validation, exact submission, routing guard, and reset', async ({ page }, info) => {
    test.skip(!mockContact, 'Runs only against the isolated contact mock.');
    const faults = observe(page);
    const mock = await mockContactPost(page, { hold: true });
    await page.goto('/contact', { waitUntil: 'networkidle' });
    const submit = page.locator('[data-submit-button]');
    const form = page.locator('[data-contact-form]');
    const state = page.locator('[data-state-rail]');
    const status = page.locator('[data-form-status]');
    const name = page.getByRole('textbox', { name: /^Name Required/ });
    const email = page.getByRole('textbox', { name: /^Email Required/ });
    const organization = page.getByRole('textbox', { name: /Business \/ organization/i });
    const category = page.getByRole('combobox', { name: /What can we help with/i });
    const messageField = page.getByRole('textbox', { name: /Message \/ question/i });
    const meetingOption = page.locator('[data-meeting-option]');
    const meetingControl = page.locator('input[name="meetingRequested"]');
    const localNote = page.locator('[data-local-appointment-note]');

    await expect(status).toHaveAttribute('role', 'status');
    await expect(status).toHaveAttribute('aria-live', 'polite');
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(state).toHaveAttribute('data-state', 'error');
    await expect(status).toHaveText('Check the highlighted fields and try again.');
    await expect(page.getByText(/enter your name/i)).toBeVisible();
    await expect(name).toBeFocused();
    for (const field of [name, email, category, messageField]) {
      await expect(field).toHaveAttribute('aria-invalid', 'true');
    }
    await expect(organization).toHaveAttribute('aria-invalid', 'false');
    await expect(page.locator('[data-error-for="email"]')).toHaveText('Enter a valid email address.');
    await expect(page.locator('[data-error-for="category"]')).toHaveText('Choose the closest category.');
    await expect(page.locator('[data-error-for="message"]')).toContainText('Add at least 10 characters');

    const categories = [
      'Local on-site IT support',
      'Computer / device help',
      'Website help',
      'Business systems / automation / AI',
      'Not sure — help me figure it out'
    ];
    expect(await category.locator('option:not([value=""])').allTextContents()).toEqual(categories);

    await name.fill('Double Verification Client');
    await email.fill('external.test@example.com');
    await organization.fill('');
    for (const label of categories) {
      await category.selectOption({ label });
      await expect(meetingOption).toBeHidden();
      await expect(meetingControl).toBeDisabled();
      if (label === 'Local on-site IT support') {
        await expect(localNote).toBeVisible();
      } else {
        await expect(localNote).toBeHidden();
      }
      expect(await page.evaluate(() => {
        const form = document.querySelector('[data-contact-form]');
        return form instanceof HTMLFormElement
          ? new FormData(form).get('meetingRequested')
          : 'missing-form';
      })).toBeNull();
    }
    const incidentCategory = 'Not sure — help me figure it out';
    await category.selectOption({ label: incidentCategory });
    expect(incidentCategory.codePointAt(9)).toBe(0x2014);
    const message = 'Contact Desk verification ' + info.project.name +
      ' pass ' + (info.repeatEachIndex + 1);
    await messageField.fill(message);
    const requestIdBefore = await form.locator('[name="requestId"]').inputValue();
    const startedAtBefore = await form.locator('[name="formStartedAt"]').inputValue();
    await submit.click({ noWaitAfter: true });
    await expect(state).toHaveAttribute('data-state', 'routing');
    await expect(submit).toBeDisabled();
    await expect(submit).toHaveAttribute('aria-busy', 'true');
    await expect(submit).toContainText('Routing message');
    await expect(status).toHaveText('Message routed. Waiting for confirmation.');
    await expect.poll(() => mock.requests.length).toBe(1);

    await page.evaluate(() => {
      const current = document.querySelector('[data-contact-form]');
      if (current instanceof HTMLFormElement) {
        current.requestSubmit();
        current.requestSubmit();
      }
    });
    await name.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);
    expect(mock.requests).toHaveLength(1);
    expect(mock.requests[0].data.category).toBe(incidentCategory);
    expect(mock.requests[0].raw).toContain('%E2%80%94');
    expect(mock.requests[0].data.organization).toBe('');
    expect(mock.requests[0].data).not.toHaveProperty('meetingRequested');

    mock.release();
    await expect(page.getByRole('heading', { name: 'We received your message.' })).toBeVisible();
    await expect(state).toHaveAttribute('data-state', 'confirmed');
    await expect(status).toHaveText('Message confirmed. A copy is on its way to your inbox.');
    await expect(submit).toHaveAttribute('aria-busy', 'false');
    await expect(submit).toContainText('Route message');
    await expect(page.getByText(message, { exact: true })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /schedule your discovery meeting/i })
    ).toHaveCount(0);

    await page.getByRole('button', { name: /send another message/i }).click();
    await expect(form).toBeVisible();
    await expect(page.locator('[data-confirmation]')).toBeHidden();
    await expect(name).toBeFocused();
    await expect(name).toHaveValue('');
    await expect(email).toHaveValue('');
    await expect(organization).toHaveValue('');
    await expect(category).toHaveValue('');
    await expect(messageField).toHaveValue('');
    await expect(state).toHaveAttribute('data-state', 'input');
    await expect(submit).toBeEnabled();
    await expect(submit).toHaveAttribute('aria-busy', 'false');
    const requestIdAfter = await form.locator('[name="requestId"]').inputValue();
    const startedAtAfter = await form.locator('[name="formStartedAt"]').inputValue();
    expect(requestIdAfter).not.toBe(requestIdBefore);
    expect(startedAtAfter).not.toBe(startedAtBefore);

    expect(faults).toEqual([]);
  });

  test('recoverable Contact Desk error preserves fields and envelope', async ({ page }) => {
    test.skip(!mockContact, 'Runs only against the isolated contact mock.');
    const faults = observe(page);
    const mock = await mockContactPost(page, {
      mode: 'error',
      errorMessage: 'Synthetic recoverable error.'
    });
    await page.goto('/contact', { waitUntil: 'networkidle' });
    const values = await fillContactForm(page, { organization: 'Recovery Lab' });
    const form = page.locator('[data-contact-form]');
    const requestId = await form.locator('[name="requestId"]').inputValue();
    const startedAt = await form.locator('[name="formStartedAt"]').inputValue();

    await page.getByRole('button', { name: /route message/i }).click();
    await expect.poll(() => mock.requests.length).toBe(1);
    await expect(page.locator('[data-state-rail]')).toHaveAttribute('data-state', 'error');
    await expect(page.locator('[data-form-status]')).toHaveText('Synthetic recoverable error.');
    await expect(page.getByRole('button', { name: /route message/i })).toBeEnabled();
    await expect(page.getByRole('button', { name: /route message/i }))
      .toHaveAttribute('aria-busy', 'false');
    await expect(page.getByRole('textbox', { name: /^Name Required/ })).toHaveValue(values.name);
    await expect(page.getByRole('textbox', { name: /^Email Required/ })).toHaveValue(values.email);
    await expect(page.getByRole('textbox', { name: /Business \/ organization/i }))
      .toHaveValue(values.organization);
    await expect(page.getByRole('combobox', { name: /What can we help with/i }))
      .toHaveValue(values.category);
    await expect(page.getByRole('textbox', { name: /Message \/ question/i }))
      .toHaveValue(values.message);
    await expect(form.locator('[name="requestId"]')).toHaveValue(requestId);
    await expect(form.locator('[name="formStartedAt"]')).toHaveValue(startedAt);
    await expect(page.locator('[data-confirmation]')).toBeHidden();
    expect(faults).toEqual([]);
  });

  test('untrusted callbacks are ignored and timeout preserves ambiguous submission', async ({ page }) => {
    test.skip(!mockContact, 'Runs only against the isolated contact mock.');
    test.slow();
    const faults = observe(page);
    const mock = await mockContactPost(page, { mode: 'no-callback' });
    await page.goto('/contact', { waitUntil: 'networkidle' });
    const values = await fillContactForm(page, { organization: 'Timeout Lab' });
    const form = page.locator('[data-contact-form]');
    const requestId = await form.locator('[name="requestId"]').inputValue();
    const startedAt = await form.locator('[name="formStartedAt"]').inputValue();

    await page.getByRole('button', { name: /route message/i }).click();
    await expect.poll(() => mock.requests.length).toBe(1);
    await expect(page.locator('[data-state-rail]')).toHaveAttribute('data-state', 'routing');
    await page.evaluate((currentRequestId) => {
      const payload = {
        type: 'malone-contact-result',
        requestId: currentRequestId,
        ok: true,
        message: 'Message confirmed.'
      };
      window.dispatchEvent(new MessageEvent('message', {
        origin: 'https://attacker.example',
        data: payload
      }));
      window.dispatchEvent(new MessageEvent('message', {
        origin: 'https://synthetic-script.googleusercontent.com',
        data: { ...payload, requestId: 'wrong-request-id-0000' }
      }));
    }, requestId);
    await page.waitForTimeout(150);
    await expect(page.locator('[data-state-rail]')).toHaveAttribute('data-state', 'routing');
    await expect(form).toBeVisible();
    await expect(page.locator('[data-confirmation]')).toBeHidden();

    const ambiguity = 'We could not confirm whether your message arrived. Delivery may already have succeeded, so check your inbox before retrying or use the direct email path.';
    await expect(page.locator('[data-form-status]')).toHaveText(ambiguity, { timeout: 17000 });
    await expect(page.locator('[data-state-rail]')).toHaveAttribute('data-state', 'error');
    await expect(page.getByRole('button', { name: /route message/i })).toBeEnabled();
    await expect(page.getByRole('button', { name: /route message/i }))
      .toHaveAttribute('aria-busy', 'false');
    await expect(page.getByRole('textbox', { name: /^Name Required/ })).toHaveValue(values.name);
    await expect(page.getByRole('textbox', { name: /^Email Required/ })).toHaveValue(values.email);
    await expect(page.getByRole('textbox', { name: /Business \/ organization/i }))
      .toHaveValue(values.organization);
    await expect(page.getByRole('combobox', { name: /What can we help with/i }))
      .toHaveValue(values.category);
    await expect(page.getByRole('textbox', { name: /Message \/ question/i }))
      .toHaveValue(values.message);
    await expect(form.locator('[name="requestId"]')).toHaveValue(requestId);
    await expect(form.locator('[name="formStartedAt"]')).toHaveValue(startedAt);
    expect(mock.requests).toHaveLength(1);
    expect(faults).toEqual([]);
  });

  test('malformed booking URL is never presented', async ({ page }) => {
    test.skip(!mockContact, 'Runs only against the isolated contact mock.');
    const faults = observe(page);
    const mock = await mockContactPost(page, { bookingUrl: 'javascript:alert(1)' });
    await page.goto('/contact', { waitUntil: 'networkidle' });
    await fillContactForm(page, { category: 'Website help' });
    await page.locator('input[name="meetingRequested"]').evaluate((control) => {
      control.disabled = false;
      control.checked = true;
    });
    await page.getByRole('button', { name: /route message/i }).click();
    await expect.poll(() => mock.requests.length).toBe(1);
    expect(mock.requests[0].data.meetingRequested).toBe('yes');
    await expect(page.getByRole('heading', { name: 'We received your message.' })).toBeVisible();
    const booking = page.locator('[data-booking-button]');
    await expect(booking).toBeHidden();
    await expect(booking).not.toHaveAttribute('href', /.+/);
    expect(faults).toEqual([]);
  });

  test('keyboard path and reduced motion remain usable', async ({ page }) => {
    const faults = observe(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/contact', { waitUntil: 'networkidle' });
    const visited = [];
    for (let index = 0; index < 18; index += 1) {
      await page.keyboard.press('Tab');
      visited.push(await page.evaluate(() => ({
        tag: document.activeElement?.tagName || '',
        name: document.activeElement?.getAttribute?.('name') || ''
      })));
    }
    expect(visited.some((item) => item.name === 'name')).toBeTruthy();
    expect(visited.some((item) => item.name === 'email')).toBeTruthy();
    expect(visited.some((item) => item.name === 'message')).toBeTruthy();
    expect(visited.some((item) => item.tag === 'BUTTON')).toBeTruthy();

    const longest = await page.evaluate(() => Math.max(
      0,
      ...[...document.querySelectorAll('body *')].flatMap((element) => {
        const style = getComputedStyle(element);
        return [...style.animationDuration.split(','),
          ...style.transitionDuration.split(',')]
          .map((value) => value.trim())
          .filter(Boolean)
          .map((value) => value.endsWith('ms')
            ? parseFloat(value)
            : parseFloat(value) * 1000);
      }).filter(Number.isFinite)
    ));
    expect(longest).toBeLessThanOrEqual(100);
    expect(faults).toEqual([]);
  });
});

