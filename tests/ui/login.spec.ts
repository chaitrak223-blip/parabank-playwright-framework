import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login', () => {

  test('should show homepage with login form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectLoginFormVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('john', 'demo');
  await loginPage.expectLoginSuccessful();
});

  test('should show error with wrong credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wronguser', 'wrongpass');
    await loginPage.expectErrorVisible();
  });

});