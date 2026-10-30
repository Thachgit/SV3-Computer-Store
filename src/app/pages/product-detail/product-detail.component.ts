import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CatalogService } from '../../services/catalog.service';
import { CartService } from '../../services/cart.service';
import { PreferencesService } from '../../services/preferences.service';

interface GalleryView {
  id: string;
  image: string;
  position: string;
  zoom: number;
  origin: string;
}

const GALLERY_CROPS: Omit<GalleryView, 'image'>[] = [
  { id: 'full', position: '50% 50%', zoom: 1, origin: 'center' },
  { id: 'upper', position: '50% 28%', zoom: 1.25, origin: '50% 28%' },
  { id: 'left', position: '28% 56%', zoom: 1.3, origin: '28% 56%' },
  { id: 'right', position: '72% 56%', zoom: 1.3, origin: '72% 56%' },
];

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (product(); as laptop) {
      <section class="container detail-page">
        <a class="back-link" routerLink="/">
          ← {{ km() ? 'ត្រឡប់ទៅកុំព្យូទ័រ' : 'Back to laptops' }}
        </a>

        <div class="detail-layout">
          <div class="detail-gallery">
            <div class="detail-image">
              <img
                [src]="activeImage().image"
                [alt]="laptop.brand + ' ' + laptop.model"
                [style.object-position]="activeImage().position"
                [style.transform]="'scale(' + activeImage().zoom + ')'"
                [style.transform-origin]="activeImage().origin">
            </div>
            <div class="detail-thumbnails" role="group" [attr.aria-label]="km() ? 'រូបភាពផលិតផល' : 'Product images'">
              @for (view of galleryImages(); track view.id; let index = $index) {
                <button
                  class="detail-thumbnail"
                  [class.active]="activeImage().id === view.id"
                  [attr.aria-label]="(km() ? 'មើលរូបទី ' : 'View image ') + (index + 1)"
                  [attr.aria-pressed]="activeImage().id === view.id"
                  type="button"
                  (click)="selectImage(view.id)">
                  <img
                    [src]="view.image"
                    [alt]="laptop.model + ' — ' + (index + 1)"
                    [style.object-position]="view.position"
                    [style.transform]="'scale(' + view.zoom + ')'"
                    [style.transform-origin]="view.origin">
                </button>
              }
            </div>
          </div>

          <div class="detail-copy">
            <div class="eyebrow dark-eyebrow">{{ laptop.brand }} · {{ laptop.category }}</div>
            <h1>{{ laptop.model }}</h1>
            <div class="detail-price">{{ prefs.price(laptop.priceUsd) }}</div>
            <p>{{ laptop.description }}</p>

            <div class="spec-table">
              <div><span>{{ km() ? 'ខួរក្បាល' : 'Processor' }}</span><strong>{{ laptop.processor }}</strong></div>
              <div><span>{{ km() ? 'អង្គចងចាំ' : 'Memory' }}</span><strong>{{ laptop.memory }}</strong></div>
              <div><span>{{ km() ? 'ផ្ទុកទិន្នន័យ' : 'Storage' }}</span><strong>{{ laptop.storage }}</strong></div>
              <div><span>{{ km() ? 'អេក្រង់' : 'Display' }}</span><strong>{{ laptop.display }}</strong></div>
              <div><span>{{ km() ? 'ក្រាហ្វិក' : 'Graphics' }}</span><strong>{{ laptop.graphics }}</strong></div>
            </div>

            <div class="stock-note">● {{ laptop.stock }} {{ km() ? 'គ្រឿងនៅសល់' : 'in stock · ready to ship' }}</div>
            <button class="button button-primary full-button" type="button" (click)="addToCart()">
              {{ km() ? 'បន្ថែមទៅកន្ត្រក' : 'Add to cart' }} <span class="arrow-icon" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M4 12 12 4M5 4h7v7" /></svg></span>
            </button>
            <p class="warranty-note">✦ {{ km() ? 'ធានា ១២ ខែ និងជំនួយក្រោយការលក់' : '12-month warranty and local after-sales support' }}</p>
          </div>
        </div>
      </section>
    } @else {
      <div class="container empty-state detail-page">
        <h2>{{ km() ? 'រកមិនឃើញផលិតផល' : 'Laptop not found' }}</h2>
        <a routerLink="/" class="text-link">← {{ km() ? 'ត្រឡប់ទៅកាតាឡុក' : 'Return to catalog' }}</a>
      </div>
    }
  `,
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  readonly prefs = inject(PreferencesService);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  private readonly chosenImage = signal<{ productId: string; viewId: string } | null>(null);

  readonly product = computed(() => this.catalog.getById(this.params().get('id') ?? ''));
  readonly galleryImages = computed(() => {
    const current = this.product();
    if (!current) return [];
    return GALLERY_CROPS.map(view => ({ ...view, image: current.image }));
  });
  readonly activeImage = computed(() => {
    const current = this.product();
    const views = this.galleryImages();
    const chosen = this.chosenImage();
    return (current && chosen?.productId === current.id
      ? views.find(view => view.id === chosen.viewId)
      : undefined) ?? views[0] ?? { ...GALLERY_CROPS[0], image: current?.image ?? '' };
  });

  km(): boolean { return this.prefs.language() === 'km'; }

  selectImage(viewId: string): void {
    const current = this.product();
    if (current) this.chosenImage.set({ productId: current.id, viewId });
  }

  addToCart(): void {
    const item = this.product();
    if (item) this.cart.add(item.id);
  }
}
