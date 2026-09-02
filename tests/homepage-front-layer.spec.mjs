import { expect, test } from '@playwright/test';

test.describe('Homepage cohesive commercial front layer', () => {
  test('offer, service doors, and section order are explicit', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Websites, IT help, and smarter business systems.');
    await expect(page.getByText(/everyday computer problems to professional websites/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /tell me what you need/i }).first()).toHaveAttribute('href', '/contact');
    await expect(page.getByRole('link', { name: /see services/i }).first()).toHaveAttribute('href', '/services');
    await expect(page.locator('[data-service-lane]')).toHaveCount(3);
    await expect(page.getByRole('heading', { name: 'Fix it' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Build it' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Connect it' })).toBeVisible();

    const order = await page.locator('main > section').evaluateAll((sections) => sections.map((section) => section.id || section.dataset.section));
    expect(order).toEqual(['hero', 'how-we-help', 'how-it-works', 'why-malone', 'contact', 'research']);
    await expect(page.locator('.featured-work-feature')).toHaveCount(0);
    await expect(page.locator('.pricing-snapshot')).toHaveCount(0);
    await expect(page.locator('.practice-grid')).toHaveCount(0);
  });

  test('services page remains the single pricing authority', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('[data-service-offer="digital-front-door"]')).toContainText('$1,250');
    await expect(page.locator('[data-service-offer="connected-business-website"]')).toContainText('$2,500');
    await expect(page.locator('[data-care-plan="site-care"]')).toContainText('$100 / month');
  });

  test('proof is dedicated to Current Work and research stays one click away', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /see current work/i })).toHaveAttribute('href', '/projects');
    await expect(page.getByRole('link', { name: /explore research/i })).toHaveAttribute('href', '/research');
    await expect(page.locator('.research-teaser__topics')).toContainText('Wearable AI');
  });

  test('Current Work owns all proof and preserves status boundaries', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Proof with the labels left on');
    await expect(page.locator('[data-featured-work="red-barons"]')).toContainText('ACTIVE CLIENT / LIVE WIP');
    await expect(page.locator('[data-featured-work="horizon-creations"]')).toContainText('LIVE PRODUCTION / OWNER-OPERATED');
    await expect(page.locator('.content-card-grid')).toContainText('Knowledge Assist Rollout');
  });
});
