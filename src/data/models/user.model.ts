/**
 * Interfaces defining data contracts across factories, API payloads, and UI.
 */
export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'User' | 'Organizer';
}