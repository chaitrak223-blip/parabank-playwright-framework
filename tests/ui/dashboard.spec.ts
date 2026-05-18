import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';
import { loginAs } from '../../utils/testData';

test.describe('Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  test('should show accounts table after login', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.expectDashboardVisible();
  });

  test('should show total balance on accounts overview', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.expectTotalBalanceVisible();
  });

  test('should logout and redirect to homepage', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.logout();
    await expect(page).toHaveURL(/index/, { timeout: 10000 });
  });

});