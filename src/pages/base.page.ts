import { Page, test } from '@playwright/test';
import { logger } from '../utils/logger.utils';

/**
 * Abstract Base Page providing standard wrapper functions.
 * Wraps multi-step user actions inside `test.step` for clear Allure/HTML report tracing.
 */
export abstract class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigates to a relative path and logs action.
   */
  protected async navigateTo(path: string): Promise<void> {
    await test.step(`Navigate to ${path}`, async () => {
      logger.info(`Navigating to page path: ${path}`);
      await this.page.goto(path);
    });
  }

  /**
   * Helper to execute an action wrapped inside a report step.
   */
  protected async step<T>(stepName: string, action: () => Promise<T>): Promise<T> {
    return await test.step(stepName, async () => {
      logger.info(`Executing UI Step: ${stepName}`);
      return await action();
    });
  }
}