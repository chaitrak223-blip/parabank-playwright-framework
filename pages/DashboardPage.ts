import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  readonly accountsOverviewLink: Locator;
  readonly openAccountLink:      Locator;
  readonly transferFundsLink:    Locator;
  readonly logoutLink:           Locator;
  readonly welcomeMessage:       Locator;
  readonly accountTable:         Locator;
  readonly totalBalance:         Locator;

  constructor(page: Page) {
    this.page = page;

    this.accountsOverviewLink = page.locator('a[href="overview.htm"]');
    this.openAccountLink      = page.locator('a[href="openaccount.htm"]');
    this.transferFundsLink    = page.locator('a[href="transfer.htm"]');
    this.logoutLink           = page.locator('a[href="logout.htm"]');
    this.welcomeMessage       = page.locator('#leftPanel .smallText');
    this.accountTable         = page.locator('#accountTable');
    this.totalBalance         = page.locator('#accountTable tfoot td').nth(1);
  }

  async goto() {
    await this.page.goto('//overview.htm');
  }

  async logout() {
    await this.logoutLink.click();
  }

  async goToOpenAccount() {
    await this.openAccountLink.click();
  }

  async goToTransferFunds() {
    await this.transferFundsLink.click();
  }

  async goToAccountsOverview() {
    await this.accountsOverviewLink.click();
  }

  async expectDashboardVisible() {
    await expect(this.page).toHaveURL(/overview/, { timeout: 15000 });
    await expect(this.accountTable).toBeVisible({ timeout: 15000 });
  }

  async expectWelcomeMessage(username: string) {
    await expect(this.welcomeMessage).toContainText(username, { timeout: 10000 });
  }

  async getFirstAccountId(): Promise<string> {
    const firstAccountLink = this.page.locator('#accountTable tbody tr:first-child td:first-child a');
    await expect(firstAccountLink).toBeVisible({ timeout: 10000 });
    const accountId = await firstAccountLink.textContent();
    return accountId?.trim() ?? '';
  }

  async expectTotalBalanceVisible() {
    await expect(this.totalBalance).toBeVisible({ timeout: 10000 });
  } 
}