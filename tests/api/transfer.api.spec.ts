import { test, expect } from '@playwright/test';
import { ParaBankApiClient } from '../../utils/apiClient';
import { TEST_USER } from '../../utils/testData';

test.describe('API — Fund Transfer', () => {

  let customerId:    string;
  let fromAccountId: string;
  let toAccountId:   string;

  test.beforeEach(async ({ request }) => {
    const api = new ParaBankApiClient(request);

    // Login
    const customer = await api.login(
      TEST_USER.username,
      TEST_USER.password
    );
    customerId = String(customer.id);

    // Get accounts — need at least 2 to transfer between
    const accounts = await api.getAccounts(customerId);

    if (accounts.length < 2) {
      // Skip if not enough accounts
      test.skip(true, 'Need at least 2 accounts to test transfer');
    }

    fromAccountId = String(accounts[0].id);
    toAccountId   = String(accounts[1].id);
  });

  test('should transfer funds between accounts successfully', async ({ request }) => {
    const api = new ParaBankApiClient(request);

    // Get balance before transfer
    const accountBefore = await api.getAccount(fromAccountId);
    const balanceBefore = accountBefore.balance;

    // Transfer $10
    await api.transfer(fromAccountId, toAccountId, 10);

    // Get balance after transfer
    const accountAfter = await api.getAccount(fromAccountId);
    const balanceAfter = accountAfter.balance;

    // Balance should decrease by 10
    expect(balanceAfter).toBeLessThan(balanceBefore);

    console.log(`Balance before: $${balanceBefore}`);
    console.log(`Balance after:  $${balanceAfter}`);
  });

  test('should reflect transfer in transaction history', async ({ request }) => {
    const api = new ParaBankApiClient(request);

    // Transfer $25
    await api.transfer(fromAccountId, toAccountId, 25);

    // Check transaction list
    const transactions = await api.getTransactions(fromAccountId);

    expect(transactions.length).toBeGreaterThan(0);

    // Most recent transaction should be a debit
    const latest = transactions[0];
    expect(latest.amount).toBeDefined();
    expect(latest.type).toBe('Debit');

    console.log(`Latest transaction: ${latest.type} $${latest.amount}`);
  });

});