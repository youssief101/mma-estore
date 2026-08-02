import { User } from "./user.model";

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}