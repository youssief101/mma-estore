export interface Department {
  _id: string;

  name: string;

  slug: string;

  description: string;

  image: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface DepartmentResponse {
  success: boolean;
  department: Department;
}

export interface DepartmentListResponse {
  success: boolean;
  count: number;
  departments: Department[];
}