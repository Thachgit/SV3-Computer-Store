import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PreferencesService } from '../../services/preferences.service';

interface SavedOrder {
  number:string; date:string; customer:{name:string;phone:string;email:string;address:string};
  items:{name:string;quantity:number;priceUsd:number}[]; subtotalUsd:number; currency:'USD'|'KHR';
}

@Component({ standalone:true, imports:[RouterLink], template:`
  <section class="container invoice-page"><div class="invoice-actions"><a routerLink="/">← {{ km() ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to store' }}</a>@if(order){<button class="button button-primary" (click)="print()">⎙ &nbsp;{{ km() ? 'បោះពុម្ពវិក្កយបត្រ' : 'Print invoice' }}</button>}</div>
    @if(order){<article class="invoice-sheet"><div class="invoice-top"><a class="brand" routerLink="/"><span class="brand-mark">SV<span>3</span></span><span class="brand-copy">COMPUTER<small>TECH, MADE PERSONAL</small></span></a><div class="invoice-label"><strong>{{ km() ? 'វិក្កយបត្រ' : 'INVOICE' }}</strong><span>{{ order.number }}</span></div></div><div class="invoice-rule"></div><div class="invoice-meta"><div><span>{{ km() ? 'ចេញវិក្កយបត្រជូន' : 'BILLED TO' }}</span><strong>{{ order.customer.name }}</strong><p>{{ order.customer.phone }}<br>{{ order.customer.email }}<br>{{ order.customer.address }}</p></div><div><span>{{ km() ? 'កាលបរិច្ឆេទ' : 'DATE' }}</span><strong>{{ order.date }}</strong></div></div><table class="invoice-table"><thead><tr><th>{{ km() ? 'ផលិតផល' : 'ITEM' }}</th><th>{{ km() ? 'ចំនួន' : 'QTY' }}</th><th>{{ km() ? 'តម្លៃ' : 'PRICE' }}</th><th>{{ km() ? 'សរុប' : 'TOTAL' }}</th></tr></thead><tbody>@for(item of order.items;track item.name){<tr><td>{{ item.name }}</td><td>{{ item.quantity }}</td><td>{{ price(item.priceUsd) }}</td><td>{{ price(item.priceUsd*item.quantity) }}</td></tr>}</tbody></table><div class="invoice-total"><span>{{ km() ? 'សរុបត្រូវបង់' : 'TOTAL DUE' }}</span><strong>{{ price(order.subtotalUsd) }}</strong></div><div class="invoice-foot"><strong>{{ km() ? 'សូមអរគុណដែលជ្រើសរើស SV3 Computer។' : 'Thank you for choosing SV3 Computer.' }}</strong><p>{{ km() ? 'វិក្កយបត្រគំរូសម្រាប់គម្រោងសិក្សា · មិនមែនជាភស្តុតាងនៃការទូទាត់ពិតប្រាកដទេ។' : 'Demo invoice for a student project · Not proof of a real payment.' }}</p><span>SV3 COMPUTER · PHNOM PENH · +855 12 345 678</span></div></article>}
    @else {<div class="empty-cart"><div class="empty-icon">✓</div><h2>{{ km() ? 'គ្មានវិក្កយបត្រចុងក្រោយទេ' : 'No recent invoice.' }}</h2><p>{{ km() ? 'បំពេញការបញ្ជាទិញសាកល្បង ដើម្បីបង្កើតវិក្កយបត្រ។' : 'Complete a demo checkout to create an invoice.' }}</p><a routerLink="/" class="button button-primary">{{ km() ? 'មើលកុំព្យូទ័រ' : 'Browse laptops' }} ↗</a></div>}
  </section>
`})
export class InvoiceComponent {
  readonly prefs=inject(PreferencesService); readonly order=this.readOrder();
  km():boolean{return this.prefs.language()==='km';}
  price(usd:number):string{return this.prefs.formatPrice(usd,this.order?.currency ?? this.prefs.currency());}
  print():void{window.print();}
  private readOrder():SavedOrder|null{try{return JSON.parse(sessionStorage.getItem('sv3-last-order') ?? 'null') as SavedOrder|null;}catch{return null;}}
}
