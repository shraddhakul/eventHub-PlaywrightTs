import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Service class handling all API interactions for Event endpoints.
 */
export class EventService {
  constructor(private request: APIRequestContext) {}

  /**
   * Creates a new event entity and returns the raw APIResponse.
   */
  async createEvent<T = object>(payload: T): Promise<APIResponse> {
    return await this.request.post('/events', {
      data: payload,
    });
  }

  /**
   * Helper method for test state setup: Seeds an event and returns structured status & body data.
   */
  async seedEvent<T = object>(payload: T): Promise<{ responseStatus: number; data: any }> {
    const response = await this.createEvent(payload);
    const data = response.ok() ? await response.json() : null;
    return {
      responseStatus: response.status(),
      data,
    };
  }

  /**
   * Fetches a single event by ID.
   */
  async getEventById(eventId: string): Promise<APIResponse> {
    return await this.request.get(`/events/${eventId}`);
  }

  /**
   * Deletes an event by ID.
   */
  async deleteEvent(eventId: string): Promise<APIResponse> {
    return await this.request.delete(`/events/${eventId}`);
  }
}