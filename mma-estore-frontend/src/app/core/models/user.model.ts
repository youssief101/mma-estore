export interface User {
  id: string;

  username: string;

  firstName: string;

  lastName: string;

  email: string;

  phone?: string;

  role: string;

  permissions?: string[];

  addresses?: unknown[];

  createdAt?: string;

  updatedAt?: string;
}
