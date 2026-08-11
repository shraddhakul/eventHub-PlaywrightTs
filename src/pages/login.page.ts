import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object.
 * Enforces strictly role-based/user-facing locators (No CSS, No XPath).
 * NO assertions reside in this file.
 */
export class LoginPage extends BasePage {
  /* Locators defined strictly using user-visible contracts */
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: /email/i });
    this.passwordInput = page.getByRole('textbox', { name: /password/i });
    this.submitButton = page.getByRole('button', { name: /sign in|login/i });
  }

  /**
   * Opens the login page.
   */
  async open(): Promise<void> {
    await this.navigateTo('/login');
  }

  /**
   * Performs user login action sequence.
   */
  async login(email: string, pass: string): Promise<void> {
    await this.step(`Log in as ${email}`, async () => {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(pass);
      await this.submitButton.click();
    });
  }
}