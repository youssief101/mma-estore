export interface Image {
  url: string;
  isPrimary: boolean;
}

export interface InventoryVariant {
  size: string;
  stock: number;
}

export interface Inventory {
  totalStock: number;
  variants: InventoryVariant[];
}

export interface Specification {
  key: string;
  value: string;
}

export interface Display {
  featured: boolean;
  trending: boolean;
  championGear: boolean;
  newArrival: boolean;
}