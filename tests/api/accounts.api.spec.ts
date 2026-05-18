import { test, expect } from '@playwright/test';
import { ParaBankApiClient } from '../../utils/apiClient';
import { TEST_USER } from '../../utils/testData';

test.describe('API — Accounts', () => {

  let customerId: string;
  let firstAccountId: string;

  // Login before each test and get customer ID
  test.beforeEach(async ({ request }) => {
    const api = new ParaBankApiClient(request);
    const customer = await api.login(
      TEST_USER.username,
      TEST_USER.password
    );
    customerId = String(customer.id);
  });

  test('should return list of accounts for customer', async ({ request }) => {
    const api = new ParaBankApiClient(request);

    const accounts = await api.getAccounts(customerId);

    // Should be an array
    expect(Array.isArray(accounts)).toBeTruthy();
    expect(accounts.length).toBeGreaterThan(0);

    // Store first account ID for other tests
    firstAccountId = String(accounts[0].id);

    // Each account should have required fields
    const account = accounts[0];
    expect(account).toHaveProperty('id');
    expect(account).toHaveProperty('balance');
    expect(account).toHaveProperty('type');

    console.log(`Found ${accounts.length} accounts`);
    console.log(`First account ID: ${firstAccountId}`);
  });

  test('should return account details by account ID', async ({ request }) => {
    const api = new ParaBankApiClient(request);

    // Get accounts first to find an ID
    const accounts = await api.getAccounts(customerId);
    const accountId = String(accounts[0].id);

    // Get specific account
    const account = await api.getAccount(accountId);

    expect(account.id).toBeTruthy();
    expect(account.balance).toBeDefined();
    expect(account.type).toMatch(/CHECKING|SAVINGS/);

    console.log(`Account type: ${account.type}, Balance: ${account.balance}`);
  });

  test('should return transactions for an account', async ({ request }) => {
    const api = new ParaBankApiClient(request);

    // Get accounts first
    const accounts = await api.getAccounts(customerId);
    const accountId = String(accounts[0].id);

    // Get transactions
    const transactions = await api.getTransactions(accountId);

    expect(Array.isArray(transactions)).toBeTruthy();

    if (transactions.length > 0) {
      const transaction = transactions[0];
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('amount');
      expect(transaction).toHaveProperty('type');
      console.log(`Found ${transactions.length} transactions`);
    }
  });

});