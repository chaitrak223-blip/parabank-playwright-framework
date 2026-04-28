import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { OpenAccountPage } from '../pages/OpenAccountPage';
import { TransferPage }   from '../pages/TransferPage';
import { generateUser, registerAndLogin } from '../utils/testData';

test.describe('Accounts & Transfers', () => {

  test('should show accounts overview after login', async ({ page }) => {
    const user          = generateUser();
    const dashboardPage = new DashboardPage(page);

    await registerAndLogin(page, user);

    await dashboardPage.expectDashboardVisible();
    await dashboardPage.expectTotalBalanceVisible();
  });

 /* test('should open a new checking account', async ({ page }) => {
    const user            = generateUser();
    const openAccountPage = new OpenAccountPage(page);

    await registerAndLogin(page, user);

    await page.goto('/openaccount.htm');
    const newAccountId = await openAccountPage.openCheckingAccount();

    expect(newAccountId).not.toBe('');
    console.log(`New checking account created: ${newAccountId}`);
  });

  test('should open a new savings account', async ({ page }) => {
    const user            = generateUser();
    const openAccountPage = new OpenAccountPage(page);

    await registerAndLogin(page, user);

    await page.goto('/openaccount.htm');
    const newAccountId = await openAccountPage.openSavingsAccount();

    expect(newAccountId).not.toBe('');
    console.log(`New savings account created: ${newAccountId}`);
  });

  test('should transfer funds between accounts', async ({ page }) => {
    const user         = generateUser();
    const openAccountPage = new OpenAccountPage(page);
    const transferPage = new TransferPage(page);

    // Step 1 — register and login
    await registerAndLogin(page, user);

    // Step 2 — open a second account to transfer TO
    await page.goto('/openaccount.htm');
    await openAccountPage.openCheckingAccount();

    // Step 3 — transfer funds
    await page.goto('/transfer.htm');
    await transferPage.transferFunds('50');

    // Step 4 — verify success
    await transferPage.expectTransferSuccessful();
    await transferPage.expectTransferAmount('50');
  });

  test('should logout successfully', async ({ page }) => {
    const user          = generateUser();
    const dashboardPage = new DashboardPage(page);

    await registerAndLogin(page, user);
    await dashboardPage.logout();

    await expect(page).toHaveURL(/index/, { timeout: 10000 });
  });*/

});