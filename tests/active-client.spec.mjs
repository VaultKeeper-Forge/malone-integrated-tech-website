import { expect, test } from '@playwright/test';

const routes = ['/projects'];
const mobileWidths = [320, 360, 390, 412, 430];
const externalUrl = 'https://www.redbaronsbitofeverything.com/';

test.describe('Red Barons active client feature', () => {
  for (const route of routes) {
    test(`${route} presents active client work with the locked public contract`, async ({ page }) => {
      await page.goto(route);
      const feature = page.locator('.active-client-feature');
      await expect(feature).toBeVisible();
      await expect(feature).toContainText('ACTIVE CLIENT / LIVE WIP');
      await expect(feature).toContainText('Red Barons Bit of Everything');
      await expect(feature).toContainText('Pine Grove, California');
      await expect(feature).toContainText('The branded work-in-progress landing page is live now while the full online showroom continues to take shape.');
      await expect(feature).toContainText('Live now: contact, directions, store information, and the in-store Google tour.');
      await expect(feature).not.toContainText(/completed|finished|case study|success outcome/i);

      const image = feature.locator('img');
      await expect(image).toHaveAttribute('src', '/clients/red-barons/red-barons-wip-home.webp');
      await expect(image).toHaveAttribute('width', '1440');
      await expect(image).toHaveAttribute('height', '900');
      await expect(image).toHaveAttribute('alt', 'Red Barons Bit of Everything work-in-progress homepage showing the shop logo and Coming Soon message.');

      const link = feature.getByRole('link', { name: 'View the Red Barons Bit of Everything live work-in-progress website — opens in a new tab.' });
      await expect(link).toHaveAttribute('href', externalUrl);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');

      const featureTop = await feature.evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
      const genericTop = await page.getByRole('heading', { name: 'Knowledge Assist Rollout' })
        .evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
      expect(featureTop).toBeLessThan(genericTop);
    });
  }

  test('mobile matrix keeps image first, CTA usable, and page free of horizontal overflow', async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-1440', 'Run the matrix once.');
    for (const width of mobileWidths) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto('/projects');
      const feature = page.locator('.active-client-feature');
      const visualBox = await feature.locator('.active-client-feature__visual').boundingBox();
      const contentBox = await feature.locator('.active-client-feature__content').boundingBox();
      const ctaBox = await feature.locator('.active-client-feature__cta').boundingBox();
      expect(visualBox.y).toBeLessThan(contentBox.y);
      expect(ctaBox.height).toBeGreaterThanOrEqual(48);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      await page.close();
    }
  });

  test('image failure exposes the branded fallback safely', async ({ page }) => {
    await page.route('**/clients/red-barons/red-barons-wip-home.webp', (route) => route.fulfill({ status: 404, body: '' }));
    await page.goto('/projects');
    await page.locator('.active-client-feature').scrollIntoViewIfNeeded();
    await expect(page.locator('.active-client-feature__fallback')).toContainText('Red Barons Bit of Everything');
    await expect(page.locator('.active-client-feature img')).toBeHidden();
  });

  test('everyday Lens translates the active client copy on projects', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route);
      await page.locator('.active-client-feature').scrollIntoViewIfNeeded();
      await page.getByRole('button', { name: /open the malone integrated tech lens for everyday wording/i }).click();
      await expect(page.locator('body')).toContainText('A client project currently being built');
      await expect(page.locator('body')).toContainText('See the site being built');
    }
  });
});
