import { test } from '@playwright/test';
import { OpenAccountPage } from '../../pages/OpenAccountPage';
import { TransferPage }    from '../../pages/TransferPage';
import { loginAs }         from '../../utils/testData';

test.describe('Fund Transfer', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  test('should transfer funds between two accounts', async ({ page }) => {
    const openAccountPage = new OpenAccountPage(page);
    const transferPage    = new TransferPage(page);

    // Need a second account — new users only have one by default
    await page.goto('/parabank/openaccount.htm');
    await openAccountPage.openCheckingAccount();

    // Now transfer
    await page.goto('/parabank/transfer.htm');
    await transferPage.transferFunds('50');
    await transferPage.expectTransferSuccessful();
    await transferPage.expectTransferAmount('50');
  });

  test('should show transfer form with account dropdowns', async ({ page }) => {
    const transferPage = new TransferPage(page);
    await page.goto('/parabank/transfer.htm');
    await transferPage.expectTransferFormVisible();
  });

});