import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  readonly firstNameInput:  Locator;
  readonly lastNameInput:   Locator;
  readonly addressInput:    Locator;
  readonly cityInput:       Locator;
  readonly stateInput:      Locator;
  readonly zipCodeInput:    Locator;
  readonly phoneInput:      Locator;
  readonly ssnInput:        Locator;
  readonly usernameInput:   Locator;
  readonly passwordInput:   Locator;
  readonly confirmInput:    Locator;
  readonly registerButton:  Locator;
  readonly successMessage:  Locator;
  readonly errorMessage:    Locator;
  readonly registerLink:    Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput  = page.locator('input[id="customer.firstName"]');
    this.lastNameInput   = page.locator('input[id="customer.lastName"]');
    this.addressInput    = page.locator('input[id="customer.address.street"]');
    this.cityInput       = page.locator('input[id="customer.address.city"]');
    this.stateInput      = page.locator('input[id="customer.address.state"]');
    this.zipCodeInput    = page.locator('input[id="customer.address.zipCode"]');
    this.phoneInput      = page.locator('input[id="customer.phoneNumber"]');
    this.ssnInput        = page.locator('input[id="customer.ssn"]');
    this.usernameInput   = page.locator('input[id="customer.username"]');
    this.passwordInput   = page.locator('input[id="customer.password"]');
    this.confirmInput    = page.locator('input[id="repeatedPassword"]');
    this.registerButton  = page.locator('input[value="Register"]');
    //this.successMessage = page.getByRole('heading', { level: 1 });
    this.successMessage  = page.locator('#rightPanel h1').first();
    this.errorMessage    = page.locator('.error').first();
    this.registerLink    = page.locator('a[href="register.htm"]');
  }

  async goto() {
    await this.page.goto('/parabank/register.htm');
  }

  async fillForm(user: {
    firstName: string;
    lastName:  string;
    address:   string;
    city:      string;
    state:     string;
    zipCode:   string;
    phone:     string;
    ssn:       string;
    username:  string;
    password:  string;
  }) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.addressInput.fill(user.address);
    await this.cityInput.fill(user.city);
    await this.stateInput.fill(user.state);
    await this.zipCodeInput.fill(user.zipCode);
    await this.phoneInput.fill(user.phone);
    await this.ssnInput.fill(user.ssn);
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.confirmInput.fill(user.password);
  }

  async submitForm() {
    await this.registerButton.click();
  }

  async expectRegistrationSuccessful(username: string) {
  await expect(this.page.locator('#rightPanel p').first())
    .toContainText(`Welcome ${username}`, { timeout: 10000 });
}
  
  async expectErrorVisible() {
  await expect(this.page.locator('.error').first()).toBeVisible();
}
}