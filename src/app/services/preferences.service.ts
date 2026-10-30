import { Injectable, signal } from '@angular/core';
import { Currency, Language } from '../models/product';

const USD_TO_KHR = 4100;

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  readonly language = signal<Language>((localStorage.getItem('sv3-language') as Language) || 'en');
  readonly currency = signal<Currency>((localStorage.getItem('sv3-currency') as Currency) || 'USD');
  constructor() { document.documentElement.lang = this.language(); }
  setLanguage(language: Language): void { this.language.set(language); document.documentElement.lang = language; localStorage.setItem('sv3-language', language); }
  setCurrency(currency: Currency): void { this.currency.set(currency); localStorage.setItem('sv3-currency', currency); }
  price(usd: number): string {
    return this.formatPrice(usd, this.currency());
  }
  formatPrice(usd: number, currency: Currency): string {
    if (currency === 'KHR') return `${new Intl.NumberFormat('en-US').format(Math.round(usd * USD_TO_KHR))} ៛`;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(usd);
  }
}
