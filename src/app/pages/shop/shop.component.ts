import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { CartService } from '../../services/cart.service';
import { PreferencesService } from '../../services/preferences.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section container shop-page">
      <div class="section-heading">
        <div>
          <div class="eyebrow dark-eyebrow">{{ km() ? 'ហាង SV3 COMPUTER' : 'SV3 COMPUTER STORE' }}</div>
          <h2>{{ km() ? 'ផលិតផលទាំងអស់' : 'Shop laptops.' }}</h2>
          <p>{{ km() ? 'ស្វែងរកកុំព្យូទ័រដែលសាកសមនឹងអ្នក។' : 'Find the right laptop for the way you work and play.' }}</p>
        </div>
        <span class="product-count">{{ filtered().length.toString().padStart(2,'0') }} {{ km() ? 'ម៉ូដែល' : 'MODELS' }}</span>
      </div>
      <div class="filters">
        <div class="filter-list">
          <button [class.selected]="category()==='All'" (click)="selectCategory('All')">{{ km() ? 'ទាំងអស់' : 'All laptops' }}</button>
          @for (item of categories; track item) {
            <button [class.selected]="category()===item" (click)="selectCategory(item)">{{ label(item) }}</button>
          }
        </div>
        <label class="search-box"><span>⌕</span><input aria-label="Search laptops" [placeholder]="km() ? 'ស្វែងរកម៉ូដែល...' : 'Search models...'" (input)="setSearch($any($event.target).value)"></label>
      </div>
      <div class="product-grid">
        @for (product of visibleProducts(); track product.id) {
          <article class="product-card">
            <a class="product-image" [routerLink]="['/product',product.id]">
              <img [src]="product.image" [alt]="product.brand + ' ' + product.model" loading="lazy">
              @if(product.badge){<span class="badge">{{ product.badge }}</span>}
              <span class="image-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M4 12 12 4M5 4h7v7" /></svg></span>
            </a>
            <div class="product-info">
              <div class="product-brand">{{ product.brand }} <span>{{ label(product.category) }}</span></div>
              <a class="product-name" [routerLink]="['/product',product.id]">{{ product.model }}</a>
              <div class="spec-line">{{ product.processor }} · {{ product.memory }}</div>
              <div class="price-row"><strong>{{ prefs.price(product.priceUsd) }}</strong>@if(product.oldPriceUsd){<del>{{ prefs.price(product.oldPriceUsd) }}</del>}<button class="add-button" (click)="add(product.id)" [attr.aria-label]="'Add ' + product.model + ' to cart'">+</button></div>
            </div>
          </article>
        }
      </div>
      @if(filtered().length>pageSize){
        <nav class="product-pagination" aria-label="Product pagination">
          <button class="page-button" (click)="previousPage()" [disabled]="showAll() || pageIndex()===0">← {{ km() ? 'មុន' : 'Previous' }}</button>
          <span class="page-status">{{ showAll() ? filtered().length : visibleProducts().length }} / {{ filtered().length }} {{ km() ? 'ម៉ូដែល' : 'products' }}</span>
          <button class="page-button show-all-button" (click)="toggleShowAll()">{{ showAll() ? (km() ? 'លាក់' : 'Hide') : (km() ? 'បង្ហាញទាំងអស់' : 'Show all') }}</button>
          <button class="page-button next-button" (click)="nextPage()" [disabled]="showAll() || (pageIndex()+1)*pageSize>=filtered().length">{{ km() ? 'បន្ទាប់' : 'Next' }} →</button>
        </nav>
      }
      @if(filtered().length===0){<div class="empty-state">{{ km() ? 'រកមិនឃើញម៉ូដែលទេ។' : 'No laptops match that search.' }}</div>}
    </section>
  `
})
export class ShopComponent {
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  readonly prefs = inject(PreferencesService);
  readonly category = signal('All');
  readonly query = signal('');
  readonly pageSize = 8;
  readonly pageIndex = signal(0);
  readonly showAll = signal(false);
  readonly categories = ['Work','Gaming','Creator','Everyday'];
  readonly filtered = computed(() => this.catalog.products.filter(product =>
    (this.category()==='All' || product.category===this.category()) &&
    `${product.brand} ${product.model} ${product.processor}`.toLowerCase().includes(this.query().toLowerCase())));
  readonly visibleProducts = computed(() => this.showAll() ? this.filtered() :
    this.filtered().slice(this.pageIndex()*this.pageSize,(this.pageIndex()+1)*this.pageSize));

  km(): boolean { return this.prefs.language() === 'km'; }
  selectCategory(category: string): void { this.category.set(category); this.pageIndex.set(0); this.showAll.set(false); }
  setSearch(query: string): void { this.query.set(query); this.pageIndex.set(0); this.showAll.set(false); }
  nextPage(): void { if ((this.pageIndex()+1)*this.pageSize<this.filtered().length) this.pageIndex.update(page=>page+1); }
  previousPage(): void { if (this.pageIndex()>0) this.pageIndex.update(page=>page-1); }
  toggleShowAll(): void { this.showAll.update(value=>!value); this.pageIndex.set(0); }
  label(category: string): string {
    if (!this.km()) return category;
    return ({ Work:'ការងារ', Gaming:'ហ្គេម', Creator:'ច្នៃប្រឌិត', Everyday:'ប្រចាំថ្ងៃ' } as Record<string,string>)[category] ?? category;
  }
  add(productId: string): void { this.cart.add(productId); }
}
