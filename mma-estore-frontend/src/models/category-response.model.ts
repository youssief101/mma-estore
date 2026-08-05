import { Category } from "./category.model";

export interface CategoriesResponse {
  success: boolean;
  count: number;
  categories: Category[];
}

export interface CategoryResponse {
  success: boolean;
  category: Category;
}