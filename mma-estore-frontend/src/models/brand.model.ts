export interface Brand {
  _id: string;

  name: string;

  slug: string;

  logo: string;

  description: string;

  website?: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface BrandResponse {
  success: boolean;
  brand: Brand;
}

export interface BrandListResponse {
  success: boolean;
  count: number;
  brands: Brand[];
}