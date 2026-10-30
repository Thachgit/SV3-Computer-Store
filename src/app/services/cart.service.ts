import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/product';
import { CatalogService } from './catalog.service';

const STORAGE_KEY = 'sv3-cart-v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly state = signal<CartItem[]>(this.readCart());
  readonly items = this.state.asReadonly();
  readonly count = computed(() => this.state().reduce((total, item) => total + item.quantity, 0));
  readonly detailedItems = computed(() => this.state().flatMap(item => {
    const product = this.catalog.getById(item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  }));

  constructor(private catalog: CatalogService) {}

  add(productId: string): void {
    const product = this.catalog.getById(productId);
    if (!product) return;
    this.state.update(items => {
      const existing = items.find(item => item.productId === productId);
      if (existing) return items.map(item => item.productId === productId
        ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item);
      return [...items, { productId, quantity: 1 }];
    });
    this.save();
  }

  setQuantity(productId: string, quantity: number): void {
    const product = this.catalog.getById(productId);
    if (!product) return;
    if (quantity <= 0) { this.remove(productId); return; }
    this.state.update(items => items.map(item => item.productId === productId
      ? { ...item, quantity: Math.min(Math.floor(quantity), product.stock) } : item));
    this.save();
  }

  remove(productId: string): void { this.state.update(items => items.filter(item => item.productId !== productId)); this.save(); }
  clear(): void { this.state.set([]); this.save(); }
  subtotal(): number { return this.detailedItems().reduce((sum, item) => sum + item.product.priceUsd * item.quantity, 0); }

  private readCart(): CartItem[] {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      return Array.isArray(saved) ? saved.filter((item): item is CartItem =>
        typeof item?.productId === 'string' && Number.isInteger(item?.quantity) && item.quantity > 0) : [];
    } catch { return []; }
  }
  private save(): void { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state())); }
}
