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

test('speed slider updates center speed readout', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('speed-slider').fill('150');
  await expect(page.getByTestId('speed-value')).toHaveText('150');
});

test('language selector updates labels to Spanish', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('combobox', { name: 'Language' }).selectOption('es');
  await expect(page.getByRole('combobox', { name: 'Idioma' })).toBeVisible();
});