import { faker } from '@faker-js/faker';
import { User } from '../models/user.model';

/**
 * Factory for creating unique dynamic test data per test run.
 * Ensures zero hardcoded data and eliminates cross-test state collision.
 */
export class DataFactory {
  /**
   * Generates a completely unique User model.
   */
  static createUser(overrides?: Partial<User>): User {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email({ provider: 'test.eventhub.com' }),
      role: 'User',
      ...overrides,
    };
  }
}