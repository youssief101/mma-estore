import { User } from "./user.model";

export interface CurrentUserResponse {
  success: boolean;
  user: User;
}