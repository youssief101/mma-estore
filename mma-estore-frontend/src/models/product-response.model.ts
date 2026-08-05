import { Product } from "./product.model";

export interface ProductResponse {
  success: boolean;
  product: Product;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  products: Product[];
}

export interface PaginatedProductsResponse {
  success: boolean;

  page: number;
  limit: number;

  totalProducts: number;
  totalPages: number;

  count: number;

  products: Product[];
}