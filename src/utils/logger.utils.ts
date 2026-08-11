import pino from 'pino';
import { Config } from '../../config/env.config';

/**
 * Structured logger utility using Pino.
 * Provides clean, formatted log outputs across framework components.
 */
export const logger = pino({
  level: Config.logLevel,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    },
  },
});