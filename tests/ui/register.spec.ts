import { test } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { generateUser } from '../../utils/testData';

test.describe('Registration', () => {

  test('should register a new user successfully', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const user = generateUser();

    await registerPage.goto();
    await registerPage.fillForm(user);
    await registerPage.submitForm();
    await registerPage.expectRegistrationSuccessful(user.username);
    console.log("Generated username:", user.username);
  });

  test('should show error when username already exists', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // john is a permanent user on ParaBank — always exists
    const existingUser = generateUser();
    existingUser.username = 'john';

    await registerPage.goto();
    await registerPage.fillForm(existingUser);
    await registerPage.submitForm();
    await registerPage.expectErrorVisible();
  });

  test('should show validation errors when form is empty', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.submitForm();
    await registerPage.expectErrorVisible();
  });

});