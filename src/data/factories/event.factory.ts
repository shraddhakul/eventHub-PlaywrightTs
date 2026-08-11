import { faker } from '@faker-js/faker';
import { EventData } from '../models/event.model';

/**
 * Factory for creating unique dynamic test data per test run.
 * Ensures zero hardcoded data and eliminates cross-test state collision.
 */
export class DataFactory {

  /**
   * Generates a unique Event model for API seeding or UI validation.
   */
  static createEvent(overrides?: Partial<EventData>): EventData {
    return {
      title: `Event-${faker.string.alphanumeric(8)}-${faker.word.sample()}`,
      description: faker.lorem.sentence(),
      date: faker.date.future().toISOString().split('T')[0],
      capacity: faker.number.int({ min: 10, max: 500 }),
      ...overrides,
    };
  }
}