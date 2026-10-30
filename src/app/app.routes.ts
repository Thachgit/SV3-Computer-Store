import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/catalog/catalog.component').then(m => m.CatalogComponent), title: 'SV3 Computer | Premium Laptops' },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent), title: 'About Us | SV3 Computer' },
  { path: 'product/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent), title: 'Laptop details | SV3 Computer' },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent), title: 'Your cart | SV3 Computer' },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent), title: 'Checkout | SV3 Computer' },
  { path: 'invoice', loadComponent: () => import('./pages/invoice/invoice.component').then(m => m.InvoiceComponent), title: 'Invoice | SV3 Computer' },
  { path: '**', redirectTo: '' }
];
