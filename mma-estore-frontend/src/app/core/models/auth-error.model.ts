export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthErrorResponse {
  success: boolean;
  message?: string;
  errors?: ValidationError[];
}