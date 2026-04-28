# parabank-playwright-framework

A professional, end-to-end test automation framework built with **Playwright** and **TypeScript**, targeting the [ParaBank](https://parabank.parasoft.com/parabank/index.htm) banking demo application. Designed to reflect real-world QA automation practices used in enterprise environments.

---

## 🚀 Features

- ✅ **Page Object Model (POM)** — clean separation of test logic and page interactions
- ✅ **TypeScript** — fully typed for better maintainability and IDE support
- ✅ **Dynamic Test Data** — unique users generated per test run using timestamp + random seed
- ✅ **Test Isolation** — every test creates its own independent user, no shared state
- ✅ **API Testing** — REST API validation using Playwright's built-in `request` context *(coming soon)*
- ✅ **HTML Reporting** — built-in Playwright HTML report with screenshots and videos on failure
- ✅ **CI/CD Integration** — automated test execution via GitHub Actions on every push and pull request
- ✅ **Cross-browser Ready** — configured for Chromium, easily extendable to Firefox and WebKit

---

## 🏗️ Project Structure

```
parabank-playwright-framework/
│
├── pages/                        # Page Object Model layer
│   ├── LoginPage.ts              # Login form — locators, actions, assertions
│   ├── RegisterPage.ts           # Registration form — multi-field, validation
│   ├── DashboardPage.ts          # Accounts overview — table, nav, logout
│   ├── OpenAccountPage.ts        # Open new account — dropdown, account ID
│   └── TransferPage.ts           # Fund transfer — amount, accounts, result
│
├── tests/
│   └── ui/                       # UI end-to-end test suites
│       ├── login.spec.ts         # Login — happy path, error handling
│       ├── register.spec.ts      # Registration — success, duplicate, validation
│       └── accounts.spec.ts      # Banking flows — overview, open, transfer, logout
│
├── utils/
│   └── testData.ts               # Test data factory — generateUser(), registerAndLogin()
│
├── test-results/                 # Auto-generated — screenshots, videos on failure
├── playwright-report/            # Auto-generated — HTML report
│
├── .github/
│   └── workflows/
│       └── playwright.yml        # GitHub Actions CI/CD pipeline
│
├── playwright.config.ts          # Framework configuration — baseURL, browser, timeouts
├── tsconfig.json                 # TypeScript compiler options
└── package.json                  # Dependencies and npm scripts
```

---

## 🧪 Test Coverage

### UI Tests — 11 test cases across 3 modules

| Module | Test Case | Type |
|--------|-----------|------|
| **Login** | Homepage shows login form | Smoke |
| **Login** | Error displayed with invalid credentials | Negative |
| **Login** | Successful login redirects to dashboard | Happy path |
| **Registration** | New user registers successfully | Happy path |
| **Registration** | Error shown when username already exists | Negative |
| **Registration** | 10 validation errors shown on empty form | Validation |
| **Accounts** | Accounts overview visible after login | Smoke |
| **Accounts** | Open new checking account | Happy path |
| **Accounts** | Open new savings account | Happy path |
| **Accounts** | Transfer funds between two accounts | E2E flow |
| **Accounts** | Logout redirects to homepage | Happy path |

---

## 🏛️ Architecture — Page Object Model

Every page in the application is represented by a dedicated TypeScript class. Tests never interact with the browser directly — they call methods on page objects.

```
┌─────────────────────────────────────────────────┐
│                  Test File (.spec.ts)           │
│   const loginPage = new LoginPage(page)         │
│   await loginPage.login('user', 'pass')         │
└────────────────────┬────────────────────────────┘
                     │ calls
┌────────────────────▼────────────────────────────┐
│              Page Object (.ts)                  │
│   async login(username, password) {             │
│     await this.usernameInput.fill(username)     │
│     await this.loginButton.click()              │
│   }                                             │
└────────────────────┬────────────────────────────┘
                     │ drives
┌────────────────────▼────────────────────────────┐
│           Playwright Browser API                │
└────────────────────┬────────────────────────────┘
                     │ hits
┌────────────────────▼────────────────────────────┐
│        parabank.parasoft.com (AUT)              │
└─────────────────────────────────────────────────┘
```

**Why POM?**
- One locator change = fix in one file, not across 20 tests
- Tests read like plain English user stories
- Methods are reusable across multiple test files

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [VS Code](https://code.visualstudio.com/) (recommended)
- Playwright VS Code extension (optional but useful)

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/chaitrak223-blip/parabank-playwright-framework.git
cd parabank-playwright-framework
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Run all tests

```bash
npx playwright test
```

### 5. Run tests with browser visible

```bash
npx playwright test --headed
```

### 6. Run a specific test file

```bash
npx playwright test tests/ui/login.spec.ts
```

### 7. View HTML report

```bash
npx playwright show-report
```

---

## 🔧 Configuration

All framework settings are managed in `playwright.config.ts`:

```ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://parabank.parasoft.com',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
  },
});
```

| Setting | Value | Reason |
|---------|-------|--------|
| `baseURL` | ParaBank demo URL | Single place to change environment |
| `workers: 1` | Sequential execution | Prevents shared-state conflicts on demo server |
| `screenshot` | On failure only | Keeps report clean, captures evidence when needed |
| `video` | Retained on failure | Full replay of failed test for debugging |

---

## 🧰 Test Data Strategy

Each test generates a **unique user** at runtime using a timestamp + random number combination:

```ts
export function generateUser() {
  const timestamp = Date.now();
  const random    = Math.floor(Math.random() * 10000);
  return {
    username: `testuser_${timestamp}_${random}`,
    password: 'Test@1234',
    // ...other fields
  };
}
```

**Benefits:**
- Zero chance of username collision between test runs
- Tests are fully independent — no setup/teardown dependencies
- No test database or fixtures required
- Mirrors real-world test isolation patterns

---

## 🔄 CI/CD — GitHub Actions

Tests run automatically on every push and pull request via GitHub Actions.

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

**Pipeline stages:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (`npm ci` — reproducible installs)
4. Install Playwright browsers with system dependencies
5. Run full test suite
6. Upload HTML report as artifact (available even when tests fail)

---

## 📊 Reporting

Playwright's built-in HTML reporter provides:
- ✅ Pass/fail status per test
- 📸 Screenshots on failure
- 🎥 Video replay on failure
- ⏱️ Execution time per test
- 🔍 Step-by-step trace viewer

```bash
npx playwright show-report
```

---

## 🗺️ Roadmap

- [x] Login module with POM
- [x] Registration module with validation tests
- [x] Account overview and banking flow tests
- [x] GitHub Actions CI/CD pipeline
- [ ] API testing module (Playwright request context)
- [ ] Allure reporting integration
- [ ] Multi-environment support (dev / staging / prod)
- [ ] Data-driven tests with JSON fixtures
- [ ] Firefox and WebKit cross-browser coverage

---

## 💼 About This Project

This framework was built as part of a structured QA automation learning path, targeting professional QA Engineer roles in Germany. It demonstrates:

- Industry-standard **Page Object Model** architecture
- **TypeScript** for type-safe, maintainable test code
- **Test isolation** and dynamic data generation strategies
- **CI/CD integration** for automated regression testing
- Real-world **banking domain** test scenarios

---

## 📬 Contact

**Chaitra Baburao Kulkarni**
- LinkedIn: [https://www.linkedin.com/in/chaitra-kulkarni-29344b19a]
- GitHub: [https://github.com/chaitrak223-blip/parabank-playwright-framework.git]
- Email: [chaitrak223@gmail.com]

---

> Built with ❤️ using [Playwright](https://playwright.dev/) and [TypeScript](https://www.typescriptlang.org/)
