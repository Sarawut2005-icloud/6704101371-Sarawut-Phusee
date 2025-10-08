import { test, expect, Page } from '@playwright/test';

/** ---------- Bootstrapping ---------- **/
const gotoApp = async (page: Page) => {
  await page.goto('http://localhost:9000/#/');   // URL Quasar app ของคุณ
  await expect(page.locator('#q-app')).toBeVisible();   // ตรวจว่ามี Quasar root
  await expect(page.locator('form')).toBeVisible();     // ตรวจว่ามีฟอร์ม
};

/** ---------- Locator helpers ---------- **/
const nameInput   = (page: Page) => page.getByLabel('Your name');
const ageInput    = (page: Page) => page.getByLabel('Your age');
const submitBtn   = (page: Page) => page.getByRole('button', { name: /submit/i });
const resetBtn    = (page: Page) => page.getByRole('button', { name: /reset/i });
const termsSwitch = (page: Page) => page.getByRole('switch', { name: /i accept/i });

test.describe('Quasar Basic Form', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page);
  });

  test('should show error when name is empty', async ({ page }) => {
    await submitBtn(page).click();
    await expect(page.getByText('Please type something')).toBeVisible();
  });

  test('should show error when age is empty', async ({ page }) => {
    await nameInput(page).fill('John Doe');
    await submitBtn(page).click();
    await expect(page.getByText('Please type your age')).toBeVisible();
  });

  test('should submit when form is valid', async ({ page }) => {
    await nameInput(page).fill('John Doe');
    await ageInput(page).fill('25');
    await termsSwitch(page).click();
    await submitBtn(page).click();

    // ตรวจว่าไม่มี error ขึ้น
    await expect(page.getByText(/Please/)).toHaveCount(0);
  });

  test('should reset form', async ({ page }) => {
    await nameInput(page).fill('John Doe');
    await ageInput(page).fill('25');
    await termsSwitch(page).click();

    await resetBtn(page).click();

    await expect(nameInput(page)).toHaveValue('');
    await expect(ageInput(page)).toHaveValue('');
    await expect(termsSwitch(page)).toHaveAttribute('aria-checked', 'false');
  });
});
