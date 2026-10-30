export interface Product {
  id: string;
  brand: string;
  model: string;
  category: 'Work' | 'Gaming' | 'Creator' | 'Everyday';
  priceUsd: number;
  oldPriceUsd?: number;
  processor: string;
  memory: string;
  storage: string;
  display: string;
  graphics: string;
  image: string;
  badge?: string;
  description: string;
  stock: number;
}

export interface CartItem { productId: string; quantity: number; }
export type Currency = 'USD' | 'KHR';
export type Language = 'en' | 'km';
