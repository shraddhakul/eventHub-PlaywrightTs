import { test, expect } from '../../src/fixtures/test.fixture';
import { DataFactory } from '../../src/data/factories/event.factory';
import { ApiValidator } from '../../src/api/validators/api.validator';
import { Config } from '../../config/env.config';

test.describe('Event Service - API Authentication & Contract Validation', () => {

  test('POST /api/events - should create event with valid bearer token', async ({
    eventService,
  }) => {
    // Arrange
    const eventPayload = DataFactory.createEvent();

    // Act: Clean service call with zero type casting required
    const response = await eventService.createEvent(eventPayload);

    // Assert: Contract & Status Code Assertion
    await ApiValidator.assertPostCreated(response, eventPayload.title);
  });

  test('POST & GET /api/events - should verify event persistence via service layer', async ({
    eventService,
  }) => {
    // Arrange
    const eventPayload = DataFactory.createEvent();

    // Act 1: Create event
    const createResponse = await eventService.createEvent(eventPayload);
    await ApiValidator.assertPostCreated(createResponse, eventPayload.title);

    const createdEvent = await createResponse.json();

    // Act 2: Fetch created event using EventService
    const fetchResponse = await eventService.getEventById(createdEvent.id);

    // Assert: Verify state persistence
    await ApiValidator.assertGetSuccess(fetchResponse);
    const fetchedBody = await fetchResponse.json();
    expect(fetchedBody.description).toBe(eventPayload.description);
  });

  test('DELETE /api/events - should remove event from server', async ({
    eventService,
  }) => {
    // Arrange: Create an event to delete
    const eventPayload = DataFactory.createEvent();
    const createResponse = await eventService.createEvent(eventPayload);
    const { id } = await createResponse.json();

    // Act: Delete event using EventService
    const deleteResponse = await eventService.deleteEvent(id);

    // Assert: Response status check (200 or 204)
    ApiValidator.assertDeleteSuccess(deleteResponse);
  });

  test('POST /api/events - without bearer token should return 401 Unauthorized', async ({
    rawRequest,
  }) => {
    // Arrange
    const eventPayload = DataFactory.createEvent();

    // Act: Direct call via raw/unauthenticated context to test security boundaries
    const response = await rawRequest.post(`${Config.apiBaseUrl}/events`, {
      data: eventPayload,
    });

    // Assert: Verify 401 status code
    ApiValidator.assertStatusCode(response, 401);
  });

});