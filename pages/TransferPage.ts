import { Page, Locator, expect } from '@playwright/test';

export class TransferPage {
  readonly page: Page;

  readonly amountInput:      Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect:   Locator;
  readonly transferButton:    Locator;
  readonly successMessage:    Locator;
  readonly transferredAmount: Locator;

  constructor(page: Page) {
    this.page = page;

    this.amountInput       = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect   = page.locator('#toAccountId');
    this.transferButton    = page.locator('input[value="Transfer"]');
    this.successMessage    = page.locator('#showResult h1');
    this.transferredAmount = page.locator('#showResult .ng-binding').first();
  }

  async goto() {
    await this.page.goto('/parabank/transfer.htm');
  }

  async transferFunds(amount: string, fromIndex: number = 0, toIndex: number = 1) {
    await expect(this.fromAccountSelect).toBeVisible({ timeout: 15000 });
    await expect(this.toAccountSelect).toBeVisible({ timeout: 15000 });

    await this.amountInput.fill(amount);

    // Select source and destination accounts by position
    const fromOptions = await this.fromAccountSelect.locator('option').all();
    const toOptions   = await this.toAccountSelect.locator('option').all();

    if (fromOptions.length > fromIndex) {
      const fromValue = await fromOptions[fromIndex].getAttribute('value');
      await this.fromAccountSelect.selectOption(fromValue ?? '');
    }

    if (toOptions.length > toIndex) {
      const toValue = await toOptions[toIndex].getAttribute('value');
      await this.toAccountSelect.selectOption(toValue ?? '');
    }

    await this.transferButton.click();
  }

  async expectTransferSuccessful() {
    await expect(this.successMessage)
      .toContainText('Transfer Complete!', { timeout: 15000 });
  }

  async expectTransferAmount(amount: string) {
    await expect(this.page.locator('#showResult'))
      .toContainText(amount, { timeout: 10000 });
  }
}