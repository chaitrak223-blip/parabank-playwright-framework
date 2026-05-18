import { Page, Locator, expect } from '@playwright/test';

export class TransferPage {
  readonly page: Page;

  readonly amountInput:       Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect:   Locator;
  readonly transferButton:    Locator;
  readonly successHeading:    Locator;
  readonly resultPanel:       Locator;

  constructor(page: Page) {
    this.page = page;

    this.amountInput       = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect   = page.locator('#toAccountId');
    this.transferButton    = page.locator('input[value="Transfer"]');
    this.successHeading    = page.locator('#showResult h1');
    this.resultPanel       = page.locator('#showResult');
  }

  // ── Navigation ───────────────────────────────────────────────

  async goto() {
    await this.page.goto('/parabank/transfer.htm');
  }

  // ── Actions ──────────────────────────────────────────────────

  async transferFunds(
    amount: string,
    fromIndex: number = 0,
    toIndex: number  = 1
  ) {
    // Wait for both dropdowns to load via AJAX
    await expect(this.fromAccountSelect)
      .toBeVisible({ timeout: 15000 });
    await expect(this.toAccountSelect)
      .toBeVisible({ timeout: 15000 });

    // Fill amount
    await this.amountInput.fill(amount);

    // Select FROM account by position
    const fromOptions = await this.fromAccountSelect
      .locator('option').all();
    if (fromOptions.length > fromIndex) {
      const fromValue = await fromOptions[fromIndex]
        .getAttribute('value');
      await this.fromAccountSelect.selectOption(fromValue ?? '');
    }

    // Select TO account by position
    const toOptions = await this.toAccountSelect
      .locator('option').all();
    if (toOptions.length > toIndex) {
      const toValue = await toOptions[toIndex]
        .getAttribute('value');
      await this.toAccountSelect.selectOption(toValue ?? '');
    }

    await this.transferButton.click();
  }

  // ── Assertions ───────────────────────────────────────────────

  async expectTransferSuccessful() {
    await expect(this.successHeading)
      .toContainText('Transfer Complete!', { timeout: 15000 });
  }

  async expectTransferAmount(amount: string) {
    await expect(this.resultPanel)
      .toContainText(amount, { timeout: 10000 });
  }

  async expectTransferFormVisible() {
    await expect(this.amountInput)
      .toBeVisible({ timeout: 10000 });
    await expect(this.fromAccountSelect)
      .toBeVisible({ timeout: 10000 });
    await expect(this.toAccountSelect)
      .toBeVisible({ timeout: 10000 });
  }
}