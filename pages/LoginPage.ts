import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Locators — all element selectors live here, nowhere else
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton   = page.locator('input[value="Log In"]');
    this.errorMessage  = page.locator('.error');
  }
  

  // Actions — what a user can DO on this page
  async goto() { 
    await this.page.goto('/parabank/index.htm');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Assertions — what we expect to see
  async expectLoginFormVisible() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async expectErrorVisible() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectLoginSuccessful() {
    await expect(this.page).toHaveURL(/overview/);
  }
}