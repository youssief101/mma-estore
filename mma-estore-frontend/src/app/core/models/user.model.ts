export interface User {
  id: string;

  username: string;

  email: string;

  firstName: string;

  lastName: string;

  phone?: string;

  role: string;

  permissions: string[];
}
