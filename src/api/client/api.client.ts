import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { logger } from '../../utils/logger.utils';

/**
 * Base API Client wrapping Playwright's built-in request context.
 * Provides logging, standard header configurations, and baseline execution wrappers.
 */
export class ApiClient {
  constructor(protected request: APIRequestContext) {}

  /**
   * Performs an HTTP POST request and logs execution context.
   */
  async post(url: string, data: unknown, headers?: Record<string, string>): Promise<APIResponse> {
    logger.info(`[API POST] Request to: ${url}`);
    const response = await this.request.post(url, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    logger.info(`[API POST] Response Status: ${response.status()}`);
    return response;
  }

  /**
   * Performs an HTTP GET request.
   */
  async get(url: string, headers?: Record<string, string>): Promise<APIResponse> {
    logger.info(`[API GET] Request to: ${url}`);
    return await this.request.get(url, { headers });
    }
    
    /**
   * Performs an HTTP DELETE request and logs execution context.
   */
  async delete(url: string, headers?: Record<string, string>): Promise<APIResponse> {
    logger.info(`[API DELETE] Request to: ${url}`);
    const response = await this.request.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    logger.info(`[API DELETE] Response Status: ${response.status()}`);
    return response;
  }
}