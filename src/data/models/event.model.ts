/**
 * Interfaces defining data contracts across factories, API payloads, and UI.
 */

export interface EventData {
  id?: string;
  title: string;
  description: string;
  date: string;
  capacity: number;
}