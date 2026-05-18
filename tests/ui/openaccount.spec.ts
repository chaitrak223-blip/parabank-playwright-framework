import { test, expect } from '@playwright/test';
import { OpenAccountPage } from '../../pages/OpenAccountPage';
import { loginAs } from '../../utils/testData';

test.describe('Open New Account', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
    await page.goto('/parabank/openaccount.htm');
  });

  test('should open a new checking account', async ({ page }) => {
    const openAccountPage = new OpenAccountPage(page);
    const newAccountId = await openAccountPage.openCheckingAccount();
    expect(newAccountId).not.toBe('');
    console.log(`Checking account created: ${newAccountId}`);
  });

  test('should open a new savings account', async ({ page }) => {
    const openAccountPage = new OpenAccountPage(page);
    const newAccountId = await openAccountPage.openSavingsAccount();
    expect(newAccountId).not.toBe('');
    console.log(`Savings account created: ${newAccountId}`);
  });

});