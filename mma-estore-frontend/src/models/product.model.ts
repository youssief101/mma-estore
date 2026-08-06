import { Brand } from "./brand.model";
import { Category } from "./category.model";
import { Department } from "./department.model";
import { Fighter } from "./fighter.model";
import { Event } from "./event.model";

import {
  Display,
  Image,
  Inventory,
  Specification
} from "./common.model";

export interface Product {
  _id: string;

  productCode: number;

  name: string;

  slug: string;

  brandID: Brand;

  description: string;

  price: number;

  oldPrice: number | null;

  discountPercentage: number;

  onSale: boolean;

  categoryID: Category;

  fighterID: Fighter | null;

  eventID: Event | null;

  departmentID: Department;

  audience: string;

  images: Image[];

  inventory: Inventory;

  specifications: Specification[];

  display: Display;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  success: boolean;
  product: Product;
  rating: {
    type: Number,
    default: 0
},

reviewCount: {
    type: Number,
    default: 0
},
}

export interface ProductListResponse {
  success: boolean;
  page?: number;
  limit?: number;
  totalProducts?: number;
  totalPages?: number;
  count: number;
  products: Product[];
}
