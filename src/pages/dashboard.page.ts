import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Dashboard Page Object.
 * Locates elements purely like real users (aria roles, heading levels, text).
 */
export class DashboardPage extends BasePage {
  readonly pageHeading: Locator;
  readonly searchInput: Locator;
  readonly eventCards: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { level: 1, name: /dashboard|events/i });
    this.searchInput = page.getByPlaceholder(/search events/i);
    this.eventCards = page.getByRole('article');
  }

  /**
   * Searches for an event title using user actions.
   */
  async searchEvent(title: string): Promise<void> {
    await this.step(`Search for event titled: ${title}`, async () => {
      await this.searchInput.fill(title);
    });
  }

  /**
   * Gets a specific event card locator matching an exact title string.
   */
  getEventCardTitleLocator(title: string): Locator {
    return this.page.getByRole('heading', { name: title });
  }
}