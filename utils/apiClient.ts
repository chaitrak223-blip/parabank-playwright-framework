import { APIRequestContext, expect } from '@playwright/test';

export class ParaBankApiClient {
  private request: APIRequestContext;
  private baseURL: string;
  private customerId: string = '';

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseURL = 'https://parabank.parasoft.com/parabank/services/bank';
  }

  // ── Auth ─────────────────────────────────────────────────────

  async login(username: string, password: string) {
    const response = await this.request.post(
      `${this.baseURL}/login/${username}/${password}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    // Store customer ID for use in other requests
    this.customerId = String(body.id);

    return body;
  }

  async getCustomerId(): Promise<string> {
    return this.customerId;
  }

  // ── Customer ─────────────────────────────────────────────────

  async getCustomer(customerId: string) {
    const response = await this.request.get(
      `${this.baseURL}/customers/${customerId}`
    );

    expect(response.status()).toBe(200);
    return await response.json();
  }

  // ── Accounts ─────────────────────────────────────────────────

  async getAccounts(customerId: string) {
    const response = await this.request.get(
      `${this.baseURL}/customers/${customerId}/accounts`
    );

    expect(response.status()).toBe(200);
    return await response.json();
  }

  async getAccount(accountId: string) {
    const response = await this.request.get(
      `${this.baseURL}/accounts/${accountId}`
    );

    expect(response.status()).toBe(200);
    return await response.json();
  }

  // ── Transactions ─────────────────────────────────────────────

  async getTransactions(accountId: string) {
    const response = await this.request.get(
      `${this.baseURL}/accounts/${accountId}/transactions`
    );

    expect(response.status()).toBe(200);
    return await response.json();
  }

  // ── Transfer ─────────────────────────────────────────────────

  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number
  ) {
    const response = await this.request.post(
      `${this.baseURL}/transfer`,
      {
        params: {
          fromAccountId,
          toAccountId,
          amount: String(amount),
        },
      }
    );

    expect(response.status()).toBe(200);
    return response;
  }

  // ── Reusable response validator ───────────────────────────────

  async expectStatus(response: Awaited<ReturnType<APIRequestContext['get']>>, status: number) {
    expect(response.status()).toBe(status);
  }
}