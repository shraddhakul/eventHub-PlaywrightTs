/**
 * @file test.fixture.ts
 * @description Core Playwright Fixture Extension module.
 */

import { test as base, request as playwrightRequest, Page, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { EventService } from '../api/services/event.service';
import { Config } from '../../config/env.config';

/**
 * CustomFixtures Interface (Test-Scoped)
 * -----------------------------------------------------------------------------
 * Defines fixtures that are instantiated FRESH for EVERY individual test spec.
 */
type CustomFixtures = {
  /** Instantiated Page Object for Login workflows */
  loginPage: LoginPage;

  /** Instantiated Page Object for Dashboard workflows */
  dashboardPage: DashboardPage;

  /** Unauthenticated request context (used for negative security tests like 401/403 validation) */
  rawRequest: APIRequestContext;

  /** Pre-configured request context with 'Authorization: Bearer <token>' attached */
  authenticatedRequest: APIRequestContext;

  /** Pre-authenticated Browser Page (Bypasses UI login by injecting auth token) */
  authenticatedPage: Page;

  /** High-level API Service wrapper injecting the authenticated request context */
  eventService: EventService;
};

/**
 * WorkerFixtures Interface (Worker-Scoped)
 * -----------------------------------------------------------------------------
 * Defines state shared across ALL tests running within the SAME worker thread/process.
 */
type WorkerFixtures = {
  /** Cached Bearer token generated once per parallel worker process */
  workerAuthToken: string;
};

/**
 * Base Test Extension
 * -----------------------------------------------------------------------------
 * Extends Playwright's native `test` runner with our custom typed fixtures.
 */
export const test = base.extend<CustomFixtures, WorkerFixtures>({

  // ===========================================================================
  // 1. WORKER-SCOPED FIXTURES
  // ===========================================================================

  workerAuthToken: [
    async ({ playwright }, use) => {
      const tempApiContext = await playwright.request.newContext({
        baseURL: Config.apiBaseUrl,
      });

      const response = await tempApiContext.post('/auth/login', {
        data: {
          username: process.env.API_USERNAME,
          password: process.env.API_PASSWORD,
        },
      });

      const { token } = await response.json();
      await tempApiContext.dispose();

      await use(token);
    },
    { scope: 'worker' },
  ],

  // ===========================================================================
  // 2. TEST-SCOPED API FIXTURES
  // ===========================================================================

  rawRequest: async ({ request }, use) => {
    await use(request);
  },

  authenticatedRequest: async ({ workerAuthToken }, use) => {
    const authContext = await playwrightRequest.newContext({
      baseURL: Config.apiBaseUrl,
      extraHTTPHeaders: {
        Authorization: `Bearer ${workerAuthToken}`,
        'Content-Type': 'application/json',
      },
    });

    await use(authContext);
    await authContext.dispose();
  },

  // ===========================================================================
  // 3. AUTHENTICATED UI PAGE FIXTURE
  // ===========================================================================

  /**
   * Pre-authenticates the browser `page` instance using the worker token.
   * Injects the token into window.localStorage prior to navigation so UI
   * routes like `/dashboard` load in an authenticated state immediately.
   */
  authenticatedPage: async ({ page, workerAuthToken }, use) => {
    // Inject the authentication token into browser local storage before page scripts execute
    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token); // Adjust 'token' key if your frontend uses e.g. 'authToken' or 'jwt'
    }, workerAuthToken);

    await use(page);
  },

  // ===========================================================================
  // 4. PAGE OBJECT FIXTURES
  // ===========================================================================

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // ===========================================================================
  // 5. API SERVICE FIXTURES
  // ===========================================================================

  eventService: async ({ authenticatedRequest }, use) => {
    await use(new EventService(authenticatedRequest));
  },
});

export { expect } from '@playwright/test';