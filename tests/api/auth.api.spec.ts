import { test, expect } from '@playwright/test';
import { ParaBankApiClient } from '../../utils/apiClient';
import { TEST_USER } from '../../utils/testData';

test.describe('API — Authentication', () => {

  test('should login successfully and return customer data', async ({ request }) => {
    const api = new ParaBankApiClient(request);

    const customer = await api.login(
      TEST_USER.username,
      TEST_USER.password
    );

    // Assert response structure
    expect(customer).toHaveProperty('id');
    expect(customer).toHaveProperty('firstName');
    expect(customer).toHaveProperty('lastName');
    expect(customer.username).toBe(TEST_USER.username);

    console.log(`Logged in as customer ID: ${customer.id}`);
  });

  test('should return 401 for invalid credentials', async ({ request }) => {
    const response = await request.post(
      'https://parabank.parasoft.com/parabank/services/bank/login/wronguser/wrongpass'
    );

    expect(response.status()).toBe(401);
  });

  test('should return customer details after login', async ({ request }) => {
    const api = new ParaBankApiClient(request);

    // Login first to get customer ID
    const customer = await api.login(
      TEST_USER.username,
      TEST_USER.password
    );

    // Use customer ID to fetch details
    const details = await api.getCustomer(String(customer.id));

    expect(details.firstName).toBeTruthy();
    expect(details.lastName).toBeTruthy();
    expect(details.address).toHaveProperty('street');

    console.log(`Customer: ${details.firstName} ${details.lastName}`);
  });

});