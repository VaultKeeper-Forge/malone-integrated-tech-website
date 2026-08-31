import { expect, test } from '@playwright/test';

const routes = ['/', '/projects'];
const mobileWidths = [320, 360, 390, 408, 412, 430];
const desktopWidths = [1024, 1440];
const horizonUrl = 'https://horizoncreations.art/';

function horizonFeature(page) {
  return page.locator('[data-featured-work="horizon-creations"]');
}

function overlaps(first, second) {
  return first.x < second.x + second.width &&
    first.x + first.width > second.x &&
    first.y < second.y + second.height &&
    first.y + first.height > second.y;
}

test.describe('Horizon Creations owner-operated production system', () => {
  for (const route of routes) {
    test(`${route} presents Horizon after client work with its locked public meaning`, async ({ page }) => {
      await page.goto(route);
      const redBarons = page.locator('[data-featured-work="red-barons"]');
      const feature = horizonFeature(page);
      await expect(feature).toBeVisible();
      await expect(feature).toContainText('LIVE PRODUCTION / OWNER-OPERATED');
      await expect(feature).toContainText('Horizon Creations');
      await expect(feature).toContainText('Northern California');
      await expect(feature).toContainText('Commerce is mapped but not activated.');
      await expect(feature).not.toContainText(/active client|checkout is live|online ordering available|automatic fulfillment|case study|revenue uplift/i);

      const image = feature.locator('img');
      await expect(image).toHaveAttribute('src', '/systems/horizon/horizon-creations-live.webp');
      await expect(image).toHaveAttribute('width', '1035');
      await expect(image).toHaveAttribute('height', '846');
      await expect(image).toHaveAttribute('alt', 'Horizon Creations handmade leather website running as a live Malone owner-operated system.');

      const link = feature.getByRole('link', {
        name: 'View the live Horizon Creations production website — opens in a new tab.'
      });
      await expect(link).toHaveAttribute('href', horizonUrl);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');

      const redTop = await redBarons.evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
      const horizonTop = await feature.evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
      const genericTop = await page.getByRole('heading', { name: 'Knowledge Assist Rollout' })
        .evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
      expect(redTop).toBeLessThan(horizonTop);
      expect(horizonTop).toBeLessThan(genericTop);
    });
  }

  test('Horizon feature keeps the image first, CTA usable, and all required widths free of overflow', async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-1440', 'Run the matrix once.');
    for (const width of [...mobileWidths, ...desktopWidths]) {
      const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 900 } });
      for (const route of routes) {
        await page.goto(route);
        const feature = horizonFeature(page);
        const visualBox = await feature.locator('.featured-work-feature__visual').boundingBox();
        const contentBox = await feature.locator('.featured-work-feature__content').boundingBox();
        const ctaBox = await feature.locator('.featured-work-feature__cta').boundingBox();
        expect(visualBox).not.toBeNull();
        expect(contentBox).not.toBeNull();
        expect(ctaBox).not.toBeNull();
        if (width < 900) expect(visualBox.y).toBeLessThan(contentBox.y);
        expect(ctaBox.height).toBeGreaterThanOrEqual(48);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      }
      await page.close();
    }
  });

  test('mobile navigation opens and closes cleanly across the requested widths', async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-1440', 'Run the matrix once.');
    for (const width of mobileWidths) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      await page.goto('/projects');
      const toggle = page.locator('[role="button"][aria-controls]').first();
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      await page.close();
    }
  });

  test('the Lens trigger remains available without covering Horizon copy', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route);
      const feature = horizonFeature(page);
      await feature.scrollIntoViewIfNeeded();
      const trigger = page.getByRole('button', {
        name: /open the malone integrated tech lens for everyday wording/i
      });
      const triggerBox = await trigger.boundingBox();
      expect(triggerBox).not.toBeNull();
      const protectedCopy = [
        feature.locator('h3'),
        feature.locator('.featured-work-feature__summary'),
        feature.locator('.featured-work-feature__note'),
        feature.locator('.featured-work-feature__live'),
        feature.locator('.featured-work-feature__next'),
        feature.locator('.featured-work-feature__cta')
      ];
      for (const copy of protectedCopy) {
        const copyBox = await copy.boundingBox();
        expect(copyBox).not.toBeNull();
        expect(overlaps(triggerBox, copyBox)).toBe(false);
      }
    }
  });

  test('Horizon image failure exposes a branded fallback', async ({ page }) => {
    await page.route('**/systems/horizon/horizon-creations-live.webp', (route) => route.fulfill({ status: 404, body: '' }));
    await page.goto('/projects');
    const feature = horizonFeature(page);
    await feature.scrollIntoViewIfNeeded();
    await expect(feature.locator('.featured-work-feature__fallback')).toContainText('OWNER-OPERATED SYSTEM');
    await expect(feature.locator('img')).toBeHidden();
  });

  test('Malone Lens translates the Horizon feature without a blank or duplicate state', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route);
      await horizonFeature(page).scrollIntoViewIfNeeded();
      await page.getByRole('button', { name: /open the malone integrated tech lens for everyday wording/i }).click();
      await expect(page.locator('body')).toContainText('OUR OWN LIVE BUSINESS SYSTEM');
      await expect(page.locator('body')).toContainText('SEE HORIZON LIVE');
      await expect(page.locator('body')).toContainText('Online checkout comes next after inventory, shipping, returns, product details, and payment setup are confirmed.');
    }
  });

  test('reduced motion, keyboard focus, and the outbound Horizon link remain usable', async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/projects');
    const feature = horizonFeature(page);
    await expect(feature.locator('.featured-work-feature__pulse')).toHaveCSS('animation-name', 'none');
    const link = feature.getByRole('link', {
      name: 'View the live Horizon Creations production website — opens in a new tab.'
    });
    await link.focus();
    await expect(link).toBeFocused();
    const [tab] = await Promise.all([
      context.waitForEvent('page'),
      page.keyboard.press('Enter')
    ]);
    await tab.waitForLoadState('domcontentloaded');
    expect(new URL(tab.url()).origin).toBe(new URL(horizonUrl).origin);
    await tab.close();
  });
});
