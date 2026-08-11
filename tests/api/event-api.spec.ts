import { test, expect } from '../../src/fixtures/test.fixture';
import { DataFactory } from '../../src/data/factories/event.factory';
import { ApiValidator } from '../../src/api/validators/api.validator';
import { Config } from '../../config/env.config';

test.describe('Event Service - API Authentication & Contract Validation', () => {

  test('POST /api/events with valid bearer token should succeed', async ({
    authenticatedRequest,
  }) => {
    // Arrange: Generate dynamic payload
    const eventPayload = DataFactory.createEvent();

    // Act: Send request over pre-authenticated context
    const response = await authenticatedRequest.post('/events', {
      data: eventPayload,
    });

    // Assert: Verify HTTP 201 Created and response structure
    await ApiValidator.assertPostCreated(response, eventPayload.title);
  });

  test('POST /api/events without bearer token should return 401 Unauthorized', async ({
    rawRequest,
  }) => {
    // Arrange: Generate dynamic payload
    const eventPayload = DataFactory.createEvent();

    // Act: Send request using raw (unauthenticated) context
    const response = await rawRequest.post(`${Config.apiBaseUrl}/events`, {
      data: eventPayload,
    });

    // Assert: Verify server rejects unauthenticated payload
    expect(response.status(), 'Server must deny unauthenticated request').toBe(401);
  });
});