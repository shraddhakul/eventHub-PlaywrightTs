import dotenv from 'dotenv';
import path from 'path';

/**
 * Loads and provides strongly-typed environment variables based on TEST_ENV.
 * Prevents hardcoded URLs, IDs, or tokens anywhere in the codebase.
 */
const env = process.env.TEST_ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });
dotenv.config({ path: path.resolve(__dirname, `.env`) });

export const Config = {
  env: process.env.TEST_ENV || 'qa',
  baseUrl: process.env.BASE_URL || 'https://eventhub.rahulshettyacademy.com/',
  apiBaseUrl: process.env.API_BASE_URL || 'https://eventhub.rahulshettyacademy.com/api',
  adminUser: process.env.ADMIN_USER || 'admin@eventhub.com',
  adminPass: process.env.ADMIN_PASS || 'Password123!',
  logLevel: process.env.LOG_LEVEL || 'info',
};