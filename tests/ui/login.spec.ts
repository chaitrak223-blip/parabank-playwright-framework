import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TEST_USER } from '../../utils/testData';

test.describe('Login', () => {

  test('should show homepage with login form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectLoginFormVisible();
  });

  test('should show error with wrong credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wronguser', 'wrongpass');
    await loginPage.expectErrorVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.username, TEST_USER.password);
    await loginPage.expectLoginSuccessful();
  });

});