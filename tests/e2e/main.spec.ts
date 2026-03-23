import { expect, test } from '@playwright/test';

test('home page renders title', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'FastEnough' })).toBeVisible();
});

test('health card loads success state', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('health-check-btn').click();
  await expect(page.getByTestId('health-state')).toHaveText('READY');
});

test('health card shows error state for failed request', async ({ page }) => {
  await page.route('**/api/health', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'forced failure' }),
    });
  });

  await page.goto('/');
  await page.getByTestId('health-check-btn').click();
  await expect(page.getByTestId('health-state')).toHaveText('ERROR');
});
