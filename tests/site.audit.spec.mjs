import { test, expect } from '@playwright/test';
import path from 'node:path';

const routes = ['/', '/services', '/research', '/projects', '/contact'];
const productionOrigin = 'https://www.maloneintegratedtech.com';
const screenshotRoot = process.env.MALONE_SCREENSHOT_DIR || 'C:/tmp/malone-site-screenshots';
const mockContact = process.env.CONTACT_MODE === 'mock';
const localOrigin = new URL(process.env.SITE_BASE_URL || 'http://127.0.0.1:4334').origin;

function observe(page) {
  const faults = [];
  page.on('console', (message) => {
    if (message.type() === 'error') faults.push('console: ' + message.text());
  });
  page.on('pageerror', (error) => faults.push('page: ' + error.message));
  return faults;
}

async function mockContactPost(page) {
  if (!mockContact) return;
  await page.route('https://script.google.com/macros/s/**/exec', async (route) => {
    const data = new URLSearchParams(route.request().postData() || '');
    const bookingUrl = data.get('meetingRequested') === 'yes'
      ? 'https://calendar.app.google/TEST-MALONE-BOOKING'
      : '';
    const payload = {
      type: 'malone-contact-result',
      ok: true,
      requestId: String(data.get('requestId') || ''),
      message: 'Message confirmed.',
      ...(bookingUrl ? { bookingUrl } : {})
    };
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><script>window.top.postMessage(' +
        JSON.stringify(payload) + ',' + JSON.stringify(localOrigin) + ')</script>'
    });
  });
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

  test('contact validation, confirmation, and meeting path', async ({ page }, info) => {
    test.skip(!mockContact, 'Runs only against the isolated contact mock.');
    const faults = observe(page);
    await mockContactPost(page);
    await page.goto('/contact', { waitUntil: 'networkidle' });
    const submit = page.getByRole('button', { name: /route message/i });
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(page.getByText(/enter your name/i)).toBeVisible();

    await page.getByRole('textbox', { name: /^Name Required/ }).fill('Double Verification Client');
    await page.getByRole('textbox', { name: /^Email Required/ }).fill('external.test@example.com');
    await page.getByRole('textbox', { name: /Business \/ organization/i }).fill('Consumer QA');
    await page.getByRole('combobox', { name: /What can we help with/i }).selectOption({ index: 1 });
    const message = 'Contact Desk verification ' + info.project.name +
      ' pass ' + (info.repeatEachIndex + 1);
    await page.getByRole('textbox', { name: /Message \/ question/i }).fill(message);
    await submit.click();
    await expect(page.getByRole('heading', { name: 'We received your message.' })).toBeVisible();
    await expect(page.getByText(message, { exact: true })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /schedule your discovery meeting/i })
    ).toHaveCount(0);

    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('textbox', { name: /^Name Required/ }).fill('Meeting Verification Client');
    await page.getByRole('textbox', { name: /^Email Required/ }).fill('meeting.test@example.com');
    await page.getByRole('combobox', { name: /What can we help with/i }).selectOption({ index: 2 });
    await page.getByRole('textbox', { name: /Message \/ question/i }).fill(
      'Please route this discovery meeting request through the booking flow.'
    );
    await page.getByRole('checkbox', { name: /schedule an online discovery meeting/i }).check();
    await page.getByRole('button', { name: /route message/i }).click();
    await expect(page.getByRole('heading', { name: 'We received your message.' })).toBeVisible();
    const booking = page.getByRole('link', {
      name: /schedule your discovery meeting/i
    });
    await expect(booking).toBeVisible();
    await expect(booking).toHaveAttribute(
      'href',
      'https://calendar.app.google/TEST-MALONE-BOOKING'
    );
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


