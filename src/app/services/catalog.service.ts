import { Injectable } from '@angular/core';
import { PRODUCTS } from '../data/products';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  readonly products = PRODUCTS;
  getById(id: string): Product | undefined { return this.products.find(product => product.id === id); }
}
