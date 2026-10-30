import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { CatalogService } from '../../services/catalog.service';
import { CartService } from '../../services/cart.service';
import { PreferencesService } from '../../services/preferences.service';

@Component({
  standalone: true, imports: [RouterLink],
  template: `
    <section class="hero"><div class="container hero-content"><div class="hero-carousel" aria-roledescription="carousel" [attr.aria-label]="km() ? 'បដាផ្សព្វផ្សាយ' : 'Featured laptops'"><div class="hero-slide-track" [style.transform]="'translateX(-' + slideIndex() * 100 + '%)'"><div class="hero-slide" aria-roledescription="slide" aria-label="Laptop promotion 1 of 3"><div class="eyebrow"><span class="eyebrow-line"></span>{{ km() ? 'SV3 COMPUTER · ភ្នំពេញ' : 'SV3 COMPUTER · PHNOM PENH' }}</div><h1>{{ km() ? 'កុំព្យូទ័រដែលស័ក្តិសម\nនឹងការងាររបស់អ្នក។' : 'Find your next\ngreat laptop.' }}</h1><p>{{ km() ? 'ជ្រើសរើសដោយយកចិត្តទុកដាក់។ សេវាកម្មដោយស្នាមញញឹម។' : 'Thoughtfully selected laptops. Personal service, every time.' }}</p><a class="button button-light" href="#catalog">{{ km() ? 'មើលកុំព្យូទ័រ' : 'Explore laptops' }} <span>↘</span></a><div class="hero-note">{{ km() ? 'ធានាផ្លូវការ · ជំនួយដោយអ្នកជំនាញ' : 'Genuine warranty · Local expert support' }}</div></div><div class="hero-slide" aria-roledescription="slide" aria-label="Laptop promotion 2 of 3"><div class="eyebrow"><span class="eyebrow-line"></span>{{ km() ? 'សម្រាប់ការច្នៃប្រឌិត' : 'MADE FOR YOUR NEXT IDEA' }}</div><h1>{{ km() ? 'ថាមពលសម្រាប់\nគំនិតថ្មីៗ។' : 'Power for the way\nyou create.' }}</h1><p>{{ km() ? 'អេក្រង់ដ៏ស្រស់ស្អាត និងក្រាហ្វិកដ៏ខ្លាំងសម្រាប់ការងាររបស់អ្នក។' : 'Vivid displays and capable graphics for your creative work.' }}</p><a class="button button-light" routerLink="/product/msi-stealth-16">{{ km() ? 'មើលកុំព្យូទ័រ Creator' : 'Meet the creator pick' }} <span>↗</span></a><div class="hero-note">{{ km() ? 'ជ្រើសរើសដោយក្រុម SV3' : 'Selected by the SV3 team' }}</div></div><div class="hero-slide" aria-roledescription="slide" aria-label="Laptop promotion 3 of 3"><div class="eyebrow"><span class="eyebrow-line"></span>{{ km() ? 'ត្រៀមសម្រាប់ហ្គេម' : 'LEVEL UP YOUR SETUP' }}</div><h1>{{ km() ? 'លេងបានល្អ។\nធ្វើបានច្រើន។' : 'Ready for your\nnext game.' }}</h1><p>{{ km() ? 'កុំព្យូទ័រលេងហ្គេមដែលមានល្បឿនលឿន និងក្រាហ្វិករស់រវើក។' : 'Fast displays and graphics built for your next session.' }}</p><a class="button button-light" routerLink="/product/lenovo-legion-5">{{ km() ? 'មើលកុំព្យូទ័រហ្គេម' : 'Explore gaming laptops' }} <span>↗</span></a><div class="hero-note">{{ km() ? 'ជ្រើសរើសដោយក្រុម SV3' : 'Selected by the SV3 team' }}</div></div></div><div class="hero-slide-controls"><button class="slide-arrow" (click)="previousSlide()" [attr.aria-label]="km() ? 'ស្លាយមុន' : 'Previous slide'">←</button>@for(slide of slides;track slide;let i=$index){<button class="slide-dot" [class.active]="slideIndex()===i" (click)="goToSlide(i)" [attr.aria-label]="(km() ? 'ទៅស្លាយ ' : 'Go to slide ') + (i+1)" [attr.aria-current]="slideIndex()===i ? 'true' : null"></button>}<button class="slide-arrow" (click)="nextSlide()" [attr.aria-label]="km() ? 'ស្លាយបន្ទាប់' : 'Next slide'">→</button></div></div></div><div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div><div class="hero-device"><div class="device-screen"><div class="device-glow"></div><span>MAKE<br>IT YOURS.</span><small>SV3 SELECT · 2026</small></div><div class="device-base"></div></div><div class="hero-index">{{ (slideIndex()+1).toString().padStart(2,'0') }} <span>/ 03</span></div></section>
    <section class="service-strip"><div class="container service-items"><span>✦ &nbsp;{{ km() ? 'គុណភាពបានជ្រើសរើស' : 'Curated quality' }}</span><span>◇ &nbsp;{{ km() ? 'ធានា ១២ ខែ' : '12-month warranty' }}</span><span>↗ &nbsp;{{ km() ? 'ដឹកជញ្ជូននៅភ្នំពេញ' : 'Phnom Penh delivery' }}</span><span>⌁ &nbsp;{{ km() ? 'ទូទាត់ USD / KHR' : 'Pay in USD or KHR' }}</span></div></section>
    <section class="section container" id="catalog"><div class="section-heading"><div><div class="eyebrow dark-eyebrow">{{ km() ? 'ជម្រើសរបស់យើង' : 'THE SV3 SELECTION' }}</div><h2>{{ km() ? 'រកឃើញកុំព្យូទ័ររបស់អ្នក' : 'Laptops for every day.' }}</h2><p>{{ km() ? 'ជ្រើសរើសពីម៉ាកដែលអ្នកទុកចិត្ត។' : 'Considered picks for work, creativity, and play.' }}</p></div><span class="product-count">{{ filtered().length.toString().padStart(2,'0') }} {{ km() ? 'ម៉ូដែល' : 'MODELS' }}</span></div>
      <div class="filters"><div class="filter-list"><button [class.selected]="category()==='All'" (click)="selectCategory('All')">{{ km() ? 'ទាំងអស់' : 'All laptops' }}</button>@for (item of categories; track item) { <button [class.selected]="category()===item" (click)="selectCategory(item)">{{ label(item) }}</button> }</div><label class="search-box"><span>⌕</span><input aria-label="Search laptops" [placeholder]="km() ? 'ស្វែងរកម៉ូដែល...' : 'Search models...'" (input)="setSearch($any($event.target).value)"></label></div>
      <div class="product-grid">@for (product of visibleProducts(); track product.id) { <article class="product-card"><a class="product-image" [routerLink]="['/product',product.id]"><img [src]="product.image" [alt]="product.brand + ' ' + product.model" loading="lazy">@if(product.badge){<span class="badge">{{ product.badge }}</span>}<span class="image-arrow">↗</span></a><div class="product-info"><div class="product-brand">{{ product.brand }} <span>{{ label(product.category) }}</span></div><a class="product-name" [routerLink]="['/product',product.id]">{{ product.model }}</a><div class="spec-line">{{ product.processor }} · {{ product.memory }}</div><div class="price-row"><strong>{{ prefs.price(product.priceUsd) }}</strong>@if(product.oldPriceUsd){<del>{{ prefs.price(product.oldPriceUsd) }}</del>}<button class="add-button" (click)="add(product)" [attr.aria-label]="'Add ' + product.model + ' to cart'">+</button></div></div></article> }</div>
      @if(filtered().length>pageSize){<nav class="product-pagination" aria-label="Product pagination"><button class="page-button" (click)="previousPage()" [disabled]="showAll() || pageIndex()===0">← {{ km() ? 'មុន' : 'Previous' }}</button><span class="page-status">{{ showAll() ? filtered().length : visibleProducts().length }} / {{ filtered().length }} {{ km() ? 'ម៉ូដែល' : 'products' }}</span><button class="page-button show-all-button" (click)="toggleShowAll()">{{ showAll() ? (km() ? 'លាក់' : 'Hide') : (km() ? 'បង្ហាញទាំងអស់' : 'Show all') }}</button><button class="page-button next-button" (click)="nextPage()" [disabled]="showAll() || (pageIndex()+1)*pageSize>=filtered().length">{{ km() ? 'បន្ទាប់' : 'Next' }} →</button></nav>}
      @if(filtered().length===0){<div class="empty-state">{{ km() ? 'រកមិនឃើញម៉ូដែលទេ។' : 'No laptops match that search.' }}</div>}
    </section>
  `
})
export class CatalogComponent implements OnDestroy {
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  readonly prefs = inject(PreferencesService);
  readonly category = signal('All');
  readonly query = signal('');
  readonly pageSize = 8;
  readonly pageIndex = signal(0);
  readonly showAll = signal(false);
  readonly categories = ['Work','Gaming','Creator','Everyday'];
  readonly slides = [0,1,2];
  readonly slideIndex = signal(0);
  private readonly carouselTimer = window.setInterval(() => this.nextSlide(), 5500);
  readonly filtered = computed(() => this.catalog.products.filter(product =>
    (this.category()==='All' || product.category===this.category()) &&
    `${product.brand} ${product.model} ${product.processor}`.toLowerCase().includes(this.query().toLowerCase())));
  readonly visibleProducts = computed(() => this.showAll() ? this.filtered() :
    this.filtered().slice(this.pageIndex()*this.pageSize,(this.pageIndex()+1)*this.pageSize));
  products(): Product[] { return this.catalog.products; }
  km(): boolean { return this.prefs.language() === 'km'; }
  nextSlide(): void { this.slideIndex.update(index => (index + 1) % this.slides.length); }
  previousSlide(): void { this.slideIndex.update(index => (index - 1 + this.slides.length) % this.slides.length); }
  goToSlide(index: number): void { this.slideIndex.set(index); }
  ngOnDestroy(): void { window.clearInterval(this.carouselTimer); }
  selectCategory(category: string): void { this.category.set(category); this.pageIndex.set(0); this.showAll.set(false); }
  setSearch(query: string): void { this.query.set(query); this.pageIndex.set(0); this.showAll.set(false); }
  nextPage(): void { if ((this.pageIndex()+1)*this.pageSize<this.filtered().length) this.pageIndex.update(page=>page+1); }
  previousPage(): void { if (this.pageIndex()>0) this.pageIndex.update(page=>page-1); }
  toggleShowAll(): void { this.showAll.update(value=>!value); this.pageIndex.set(0); }
  label(category: string): string {
    if (!this.km()) return category;
    return ({ Work:'ការងារ', Gaming:'ហ្គេម', Creator:'ច្នៃប្រឌិត', Everyday:'ប្រចាំថ្ងៃ' } as Record<string,string>)[category] ?? category;
  }
  add(product: Product): void { this.cart.add(product.id); }
}
