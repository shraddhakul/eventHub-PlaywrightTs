import { test, expect } from '../../src/fixtures/test.fixture';
import { DataFactory } from '../../src/data/factories/event.factory';
import { Config } from '../../config/env.config';

test.describe('Event Management - E2E Authenticated Workflows', () => {

  test('Should seed event state via Authenticated API and verify on Authenticated UI', async ({
    eventService,
    dashboardPage,
    authenticatedPage,
  }) => {
    // 1. Arrange: Generate unique test data model
    const newEvent = DataFactory.createEvent();

    // 2. Seed State via API using pre-authenticated API context
    const seedResult = await eventService.seedEvent(newEvent);
    expect(seedResult.responseStatus, 'API event seeding must succeed').toBe(201);

    // 3. Act: Open authenticated dashboard directly (Bypasses UI login steps)
    await authenticatedPage.goto(`${Config.baseUrl}/dashboard`);
    await dashboardPage.searchEvent(newEvent.title);

    // 4. Assert: Validate that seeded record is displayed on the UI
    const targetEventHeader = dashboardPage.getEventCardTitleLocator(newEvent.title);
    
    await expect(targetEventHeader).toHaveText(newEvent.title);
    await expect(targetEventHeader).toBeVisible();
  });
});