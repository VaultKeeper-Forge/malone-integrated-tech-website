import { expect, test } from '@playwright/test';

const expectedPrices = [
  ['fit-check', 'Free Fit Check', 'Free'],
  ['systems-map', 'Business Systems Map', '$250'],
  ['digital-front-door', 'Digital Front Door', '$1,250'],
  ['connected-business-website', 'Connected Business Website', '$2,500'],
  ['workflow-automation', 'Workflow Automation', '$750-$1,250'],
  ['site-care', 'Site Care', '$100 / month']
];

test.describe('Homepage plain-English commercial front layer', () => {
  test('ten-second offer, service lanes, and section order are explicit', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Websites, IT help, and smarter business systems.'
    );
    await expect(page.getByText(/everyday computer problems to professional websites/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /tell me what you need/i }).first()).toHaveAttribute('href', '/contact');
    await expect(page.getByRole('link', { name: /see services & prices/i })).toHaveAttribute('href', '/services');
    await expect(page.locator('[data-service-lane]')).toHaveCount(3);
    await expect(page.getByRole('heading', { name: 'I need a website' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'I need help with my technology' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'I want my business to run better' })).toBeVisible();

    const order = await page.locator('main > section').evaluateAll((sections) =>
      sections.map((section) => section.id || section.dataset.section)
    );
    expect(order).toEqual([
      'hero',
      'what-we-build',
      'pricing',
      'systems-in-practice',
      'how-it-works',
      'contact',
      'research'
    ]);
    await expect(page.locator('.research-system')).toHaveCount(0);
    await expect(page.locator('.practice-grid')).toHaveCount(0);
  });

  test('homepage prices match the same rendered service records', async ({ page }) => {
    await page.goto('/');
    const home = {};
    for (const [id] of expectedPrices) {
      home[id] = (await page.locator(`[data-home-price="${id}"]`).innerText()).replace(/\s+/g, ' ').trim();
    }

    for (const [id, name, price] of expectedPrices) {
      expect(home[id]).toContain(name);
      expect(home[id].replace(/–/g, '-')).toContain(price);
    }

    await page.goto('/services');
    for (const [id, name, price] of expectedPrices) {
      const selector = id === 'site-care'
        ? `[data-care-plan="${id}"]`
        : `[data-service-offer="${id}"]`;
      const serviceText = (await page.locator(selector).innerText()).replace(/\s+/g, ' ').trim();
      expect(serviceText).toContain(name);
      expect(serviceText.replace(/–/g, '-')).toContain(price);
      expect(home[id].replace(/–/g, '-')).toContain(price);
    }
  });

  test('proof remains honest and deeper research stays one click away', async ({ page }) => {
    await page.goto('/');
    const red = page.locator('[data-featured-work="red-barons"]');
    const horizon = page.locator('[data-featured-work="horizon-creations"]');
    await expect(red).toContainText('ACTIVE CLIENT / LIVE WIP');
    await expect(red).toContainText('A new online home for a local Pine Grove shop');
    await expect(horizon).toContainText('LIVE PRODUCTION / OWNER-OPERATED');
    await expect(horizon).toContainText('Commerce is mapped but not activated.');
    await expect(page.getByRole('link', { name: /explore research/i })).toHaveAttribute('href', '/research');
    await expect(page.locator('.research-teaser__topics')).toContainText('Wearable AI');
    await expect(page.locator('.research-teaser__topics')).toContainText('Ambient Capture');
    await expect(page.locator('.research-teaser__topics')).toContainText('Human-AI Continuity');
  });
});
