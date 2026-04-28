import { Page, Locator, expect } from '@playwright/test';

export class OpenAccountPage {
  readonly page: Page;

  readonly accountTypeSelect: Locator;
  readonly fromAccountSelect: Locator;
  readonly openAccountButton: Locator;
  readonly newAccountId:      Locator;
  readonly successMessage:    Locator;

  constructor(page: Page) {
    this.page = page;

    this.accountTypeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.openAccountButton = page.locator('input[value="Open New Account"]');
    this.newAccountId      = page.locator('#newAccountId');
    this.successMessage    = page.locator('#openAccountResult h1');
  }

  async goto() {
    await this.page.goto('/parabank/openaccount.htm');
  }

  async openCheckingAccount(): Promise<string> {
    await expect(this.fromAccountSelect).toBeVisible({ timeout: 15000 });

    // Select CHECKING (value 0)
    await this.accountTypeSelect.selectOption('0');
    await this.openAccountButton.click();

    await expect(this.successMessage)
      .toContainText('Account Opened!', { timeout: 15000 });

    const accountId = await this.newAccountId.textContent();
    return accountId?.trim() ?? '';
  }

  async openSavingsAccount(): Promise<string> {
    await expect(this.fromAccountSelect).toBeVisible({ timeout: 15000 });

    // Select SAVINGS (value 1)
    await this.accountTypeSelect.selectOption('1');
    await this.openAccountButton.click();

    await expect(this.successMessage)
      .toContainText('Account Opened!', { timeout: 15000 });

    const accountId = await this.newAccountId.textContent();
    return accountId?.trim() ?? '';
  }

  async expectAccountOpenedSuccessfully() {
    await expect(this.successMessage)
      .toContainText('Account Opened!', { timeout: 15000 });
    await expect(this.newAccountId).toBeVisible({ timeout: 10000 });
  }
}