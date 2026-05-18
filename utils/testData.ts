import { Page, expect } from '@playwright/test';


export const TEST_USER = {
  username: 'john',
  password: 'demos',
};

// DYNAMIC USER — used only in register.spec.ts

export function generateUser() {
  const timestamp = Date.now();
  const random    = Math.floor(Math.random() * 10000);
  return {
    firstName: 'Test',
    lastName:  'User',
    address:   'Georgestrasse 1',
    city:      'Berlin',
    state:     'Berlin',
    zipCode:   '10115',
    phone:     '01234567890',
    ssn:       '123-45-6789',
    username:  `testuser_${timestamp}_${random}`,
    password:  'Test@1234',
  };
}

// ─────────────────────────────────────────────────────────────
// LOGIN HELPER — reused across all non-registration tests
// ─────────────────────────────────────────────────────────────
export async function loginAs(
  page: Page,
  username: string = TEST_USER.username,
  password: string = TEST_USER.password
) {
  await page.goto('/parabank/index.htm');
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[value="Log In"]').click();
  await expect(page).toHaveURL(/overview/, { timeout: 15000 });
}