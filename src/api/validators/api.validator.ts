import { APIResponse, expect } from '@playwright/test';

/**
 * Response Validator asserting full body contracts, status codes, and HTTP execution ranges.
 */
export class ApiValidator {
  // ==============================================================================
  // GENERIC RANGE VALIDATIONS
  // ==============================================================================

  /**
   * Asserts that the response status code falls within the 2xx success range (200-299).
   */
  static assertSuccessRange(response: APIResponse): void {
    expect(
      response.ok(), 
      `Expected status in 2xx range, but received ${response.status()}`
    ).toBeTruthy();
  }

  /**
   * Asserts that the response status code falls within the 4xx client error range (400-499).
   */
  static assertClientErrorRange(response: APIResponse): void {
    const status = response.status();
    expect(
      status >= 400 && status < 500,
      `Expected status in 4xx client error range, but received ${status}`
    ).toBeTruthy();
  }

  /**
   * Asserts that the response status code falls within the 5xx server error range (500-599).
   */
  static assertServerErrorRange(response: APIResponse): void {
    const status = response.status();
    expect(
      status >= 500 && status < 600,
      `Expected status in 5xx server error range, but received ${status}`
    ).toBeTruthy();
  }

  /**
   * Asserts an exact expected HTTP status code.
   */
  static assertStatusCode(response: APIResponse, expectedStatus: number): void {
    expect(
      response.status(),
      `Expected HTTP ${expectedStatus}, but received ${response.status()}`
    ).toBe(expectedStatus);
  }

  // ==============================================================================
  // METHOD-SPECIFIC VALIDATIONS
  // ==============================================================================

  /**
   * Asserts a successful GET request (200 OK) and verifies essential response structure.
   */
  static async assertGetSuccess(response: APIResponse): Promise<void> {
    this.assertStatusCode(response, 200);
    const body = await response.json();
    expect(body, 'GET response body should not be null or undefined').toBeDefined();
  }

  /**
   * Asserts a successful POST creation (201 Created) and verifies primary entity keys.
   */
  static async assertPostCreated(response: APIResponse, expectedTitle?: string): Promise<void> {
    this.assertStatusCode(response, 201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    
    if (expectedTitle) {
      expect(body.title).toBe(expectedTitle);
    }
  }

  /**
   * Asserts a successful DELETE request (accepts 200 OK or 204 No Content).
   */
  static assertDeleteSuccess(response: APIResponse): void {
    const status = response.status();
    expect(
      status === 200 || status === 204,
      `Expected DELETE to return status 200 or 204, but received ${status}`
    ).toBeTruthy();
  }
}