import { Page, Locator, expect } from '@playwright/test';

export class OpenAccountPage {
  readonly page: Page;

  readonly accountTypeSelect: Locator;
  readonly fromAccountSelect: Locator;
  readonly openAccountButton: Locator;
  readonly newAccountId: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Dropdowns
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');

    // Button - Playwright best practice
    this.openAccountButton = page.locator('#openAccountForm > form > div > input');

    // Scope locator to success section to avoid hidden duplicate IDs
    this.newAccountId = page
      .locator('#openAccountResult')
      .locator('#newAccountId');

    // Success heading
    this.successHeading = page.locator('#openAccountResult h1');
  }

  // ── Navigation ───────────────────────────────────────────────

  async goto() {
    await this.page.goto('/parabank/openaccount.htm');
  }

  // ── Actions ──────────────────────────────────────────────────

  async openCheckingAccount(): Promise<string> {
    await this.waitForAccountForm();

    // CHECKING = value 0
    await this.accountTypeSelect.selectOption('0');
     await this.fromAccountSelect.selectOption('1');

await this.openAccountButton.click();
   

    await this.expectAccountOpenedSuccessfully();

    return await this.getNewAccountId();
  }

  async openSavingsAccount(): Promise<string> {
    await this.waitForAccountForm();

    // SAVINGS = value 1
    await this.accountTypeSelect.selectOption('1');

    await this.openAccountButton.click();

    await this.expectAccountOpenedSuccessfully();

    return await this.getNewAccountId();
  }

  // ── Helper Methods ───────────────────────────────────────────

  async waitForAccountForm() {
    // Dropdown loads asynchronously via AJAX
    await expect(this.fromAccountSelect).toBeVisible({
      timeout: 15000,
    });

    await expect(this.openAccountButton).toBeVisible({
      timeout: 10000,
    });
  }

  async getNewAccountId(): Promise<string> {
    await expect(this.newAccountId).toBeVisible({
      timeout: 10000,
    });

    const accountId = await this.newAccountId.textContent();

    return accountId?.trim() ?? '';
  }

  // ── Assertions ───────────────────────────────────────────────

  async expectAccountOpenedSuccessfully() {
    await expect(this.successHeading).toContainText(
      'Account Opened!',
      {
        timeout: 15000,
      }
    );

    await expect(this.newAccountId).toBeVisible({
      timeout: 10000,
    });
  }

  async expectNewAccountIdVisible() {
    await expect(this.newAccountId).toBeVisible({
      timeout: 10000,
    });
  }

  async expectAccountTypeOptions(): Promise<string[]> {
    await expect(this.accountTypeSelect).toBeVisible({
      timeout: 10000,
    });

    return await this.accountTypeSelect
      .locator('option')
      .allTextContents();
  }
}