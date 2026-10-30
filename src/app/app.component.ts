import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';
import { PreferencesService } from './services/preferences.service';
import { Currency, Language } from './models/product';

@Component({
  selector: 'sv3-root', standalone: true, imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="site-header">
      <div class="topline"><div class="container top-inner"><span>{{ km() ? 'ភ្នំពេញ · ប្រទេសកម្ពុជា' : 'Phnom Penh · Cambodia' }}</span><span>{{ km() ? 'ជួយទិញទំនិញ' : 'Need help? +855 12 345 678' }}</span></div></div>
      <div class="container nav-row">
        <a class="brand" routerLink="/" aria-label="SV3 Computer home"><span class="brand-mark">SV<span>3</span></span><span class="brand-copy">COMPUTER<small>TECH, MADE PERSONAL</small></span></a>
        <nav><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">{{ km() ? 'ទំនិញ' : 'Shop' }}</a><a routerLink="/about" routerLinkActive="active">{{ km() ? 'អំពីយើង' : 'About Us' }}</a></nav>
        <div class="nav-actions">
          <select aria-label="Display currency" [value]="prefs.currency()" (change)="changeCurrency($event)"><option value="USD">USD $</option><option value="KHR">KHR ៛</option></select>
          <button class="language-toggle" (click)="toggleLanguage()">{{ km() ? 'EN' : 'ខ្មែរ' }}</button>
          <a class="cart-link" routerLink="/cart" [attr.aria-label]="'Cart, ' + cart.count() + ' items'">♧ <span>{{ km() ? 'កន្ត្រក' : 'Cart' }}</span><b>{{ cart.count() }}</b></a>
        </div>
      </div>
    </header>
    <main><router-outlet /></main>
    <footer><div class="container footer-grid"><div><a class="brand footer-brand" routerLink="/"><span class="brand-mark">SV<span>3</span></span><span class="brand-copy">COMPUTER<small>TECH, MADE PERSONAL</small></span></a><p>{{ km() ? 'បច្ចេកវិទ្យាល្អ សម្រាប់ជីវិតប្រចាំថ្ងៃ។' : 'Good technology, chosen for real life.' }}</p></div><div><strong>{{ km() ? 'ទំនាក់ទំនង' : 'Visit us' }}</strong><p>Mon–Sat · 9:00–18:00<br>Phnom Penh, Cambodia<br>+855 12 345 678</p></div><div><strong>{{ km() ? 'សេវាកម្ម' : 'Shop with confidence' }}</strong><p>{{ km() ? 'ធានា ១២ ខែ · ទូទាត់នៅហាង' : '12-month warranty · In-store payment' }}<br>{{ km() ? 'ជំនួយក្រោយការលក់' : 'Friendly after-sales support' }}</p></div></div><div class="container footer-bottom">© 2026 SV3 Computer <span>{{ km() ? 'គំរូសម្រាប់គម្រោងសិក្សា' : 'Student project demo · Sample data only' }}</span></div></footer>
  `
})
export class AppComponent {
  readonly cart = inject(CartService);
  readonly prefs = inject(PreferencesService);
  km(): boolean { return this.prefs.language() === 'km'; }
  toggleLanguage(): void { this.prefs.setLanguage(this.km() ? 'en' : 'km'); }
  changeCurrency(event: Event): void { this.prefs.setCurrency((event.target as HTMLSelectElement).value as Currency); }
}
