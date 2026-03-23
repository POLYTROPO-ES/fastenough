import { expect, test } from '@playwright/test';

test('home page renders the new title and share action', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Fast enough' })).toBeVisible();
  await expect(page.getByTestId('share-settings-btn')).toBeVisible();
});

test('url params initialize trip settings', async ({ page }) => {
  await page.goto('/?d=240&s=132&l=120');

  await expect(page.getByTestId('distance-slider')).toHaveValue('240');
  await expect(page.getByTestId('speed-slider')).toHaveValue('132');
  await expect(page.getByTestId('speed-limit-slider')).toHaveValue('120');
});

test('speed slider updates speed control value', async ({ page }) => {
  await page.goto('/');

  const speedSlider = page.getByTestId('speed-slider');
  let updated = false;

  for (let attempt = 0; attempt < 3 && !updated; attempt += 1) {
    await speedSlider.evaluate((node) => {
      const input = node as HTMLInputElement;
      input.value = '150';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    try {
      await expect(speedSlider).toHaveValue('150', { timeout: 1500 });
      updated = true;
    } catch {
      await page.waitForLoadState('domcontentloaded');
    }
  }

  expect(updated).toBeTruthy();
});

test('language selector updates labels to Spanish', async ({ page }) => {
  await page.goto('/');

  const assertSpanish = async () => {
    await expect(page.locator('.top-controls label').first()).toContainText('Velocidad actual', { timeout: 1500 });
  };

  await page.getByRole('combobox', { name: 'Language' }).selectOption('es');
  try {
    await assertSpanish();
  } catch {
    await page.getByRole('combobox', { name: 'Language' }).selectOption('es');
    await expect(page.locator('.top-controls label').first()).toContainText('Velocidad actual');
  }
});