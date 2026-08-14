import dotenv from 'dotenv';
import path from 'path';

/**
 * Loads and provides strongly-typed environment variables based on TEST_ENV.
 * Prevents hardcoded URLs, IDs, or tokens anywhere in the codebase.
 */

const env = process.env.TEST_ENV || 'qa';

// Load environment-specific file first (.env.qa), then fall back to base .env
// Reads config/.env or config/.env.qa relative to this file
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });
dotenv.config({ path: path.resolve(__dirname, `.env`) });

/**
 * Helper to enforce required environment variables at runtime.
 * Prevents silent failures or hardcoding credentials in source control.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[Config Error]: Missing required environment variable "${key}". ` +
      `Ensure it is set in your local .env or CI/CD environment variables.`
    );
  }
  return value;
}

export const Config = {
  env,
  baseUrl: process.env.BASE_URL || 'https://eventhub.rahulshettyacademy.com/',
  apiBaseUrl: process.env.API_BASE_URL || 'https://eventhub.rahulshettyacademy.com/api',
  adminUser: process.env.ADMIN_USER || 'admin@eventhub.com',
  // Enforces presence of secret in environment without hardcoding a default password in Git
  adminPass: requireEnv('ADMIN_PASS'),
  logLevel: process.env.LOG_LEVEL || 'info',
};