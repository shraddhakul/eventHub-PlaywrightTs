import { test as base, request as playwrightRequest, Page, APIRequestContext } from '@playwright/test';
// This import statement brings in Playwright's core test runner alongside its primary TypeScript 
// interfaces to build custom fixtures and page object structures.

import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { EventService } from '../api/services/event.service';
import { Config } from '../../config/env.config';

/**
 * Fixture Types Interface.
 * Injects isolated page object instances and API clients cleanly into tests.
 */
/**
 * Interface defining authentication and page fixture types.
 */
type AuthSession = {
  token: string;
  storageState: {
    cookies: Array<{ name: string; value: string; domain: string; path: string }>;
    origins: Array<{ origin: string; localStorage: Array<{ name: string; value: string }> }>;
  };
};

type CustomFixtures = {
  /* Authentication Core */
  authSession: AuthSession;
  
  /* API Context Branches */
  authenticatedRequest: APIRequestContext;
  rawRequest: APIRequestContext;
  
  /* UI Context Branches */
  authenticatedPage: Page;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  
  /* Services */
  eventService: EventService;
};

export const test = base.extend<CustomFixtures>({
  /**
   * Worker/Test-level Auth Session Fixture
   * Authenticates once via API to obtain both token and UI storageState.
   */
  authSession: async ({}, use) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: Config.apiBaseUrl,
    });

    const response = await apiContext.post('/auth/login', {
      data: {
        email: Config.adminUser,
        password: Config.adminPass,
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to authenticate fixture user: ${response.statusText()}`);
    }

    const body = await response.json();
    const token = body.token || body.accessToken;

    const storageState = {
      cookies: [],
      origins: [
        {
          origin: Config.baseUrl,
          localStorage: [{ name: 'authToken', value: token }],
        },
      ],
    };

    await use({ token, storageState });
    await apiContext.dispose();
  },

  /**
   * Authenticated API Request Context
   * Pre-loads the Authorization Bearer header into every outbound request.
   */
  authenticatedRequest: async ({ authSession }, use) => {
    const authContext = await playwrightRequest.newContext({
      baseURL: Config.apiBaseUrl,
      extraHTTPHeaders: {
        Authorization: `Bearer ${authSession.token}`,
        'Content-Type': 'application/json',
      },
    });

    await use(authContext);
    await authContext.dispose();
  },

  /**
   * Raw (Unauthenticated) Request Context
   * Re-exports Playwright's default request fixture for negative testing.
   */
  rawRequest: async ({ request }, use) => {
    await use(request);
  },

  /**
   * Authenticated UI Page Context
   * Spawns an isolated browser context pre-loaded with the auth storageState.
   */
  authenticatedPage: async ({ browser, authSession }, use) => {
    const context = await browser.newContext({
      storageState: authSession.storageState,
    });
    const page = await context.newPage();

    await use(page);

    await page.close();
    await context.close();
  },

  /* Service & Page Objects Injection */
  eventService: async ({ authenticatedRequest }: { authenticatedRequest: APIRequestContext }, use) => {
    await use(new EventService(authenticatedRequest));
  },

  dashboardPage: async ({ authenticatedPage }, use) => {
    await use(new DashboardPage(authenticatedPage));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';