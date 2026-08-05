export interface Category {
  _id: string;

  name: string;

  slug: string;

  description: string;

  image: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  category: Category;
}

export interface CategoryListResponse {
  success: boolean;
  count: number;
  categories: Category[];
}