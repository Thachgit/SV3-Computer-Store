import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PreferencesService } from '../../services/preferences.service';

@Component({ standalone:true, imports:[ReactiveFormsModule,RouterLink], template:`
  <section class="container simple-page"><div class="eyebrow dark-eyebrow">{{ km() ? 'ព័ត៌មានអ្នកទិញ' : 'A FEW DETAILS' }}</div><h1>{{ km() ? 'បញ្ជាក់ការបញ្ជាទិញ' : 'Checkout' }}</h1>
    @if(cart.detailedItems().length){<div class="checkout-layout"><form class="checkout-form" [formGroup]="form" (ngSubmit)="placeOrder()"><h2>{{ km() ? 'ព័ត៌មានទំនាក់ទំនង' : 'Contact information' }}</h2><div class="field-grid"><label>{{ km() ? 'ឈ្មោះពេញ' : 'Full name' }}<input formControlName="name" autocomplete="name" placeholder="Sokha Chan"><small [hidden]="!invalid('name')">{{ km() ? 'សូមបញ្ចូលឈ្មោះរបស់អ្នក' : 'Please enter your name.' }}</small></label><label>{{ km() ? 'លេខទូរស័ព្ទ' : 'Phone number' }}<input formControlName="phone" autocomplete="tel" placeholder="+855 12 345 678"><small [hidden]="!invalid('phone')">{{ km() ? 'សូមបញ្ចូលលេខទូរស័ព្ទ' : 'Please enter a phone number.' }}</small></label><label class="wide-field">{{ km() ? 'អ៊ីមែល (ជាជម្រើស)' : 'Email (optional)' }}<input formControlName="email" autocomplete="email" placeholder="you@example.com"></label><label class="wide-field">{{ km() ? 'អាសយដ្ឋានដឹកជញ្ជូន' : 'Delivery address' }}<textarea formControlName="address" rows="3" placeholder="{{ km() ? 'ផ្ទះ ផ្លូវ ខណ្ឌ ក្រុងភ្នំពេញ' : 'House, street, district, Phnom Penh' }}"></textarea><small [hidden]="!invalid('address')">{{ km() ? 'សូមបញ្ចូលអាសយដ្ឋាន' : 'Please enter a delivery address.' }}</small></label></div><h2 class="payment-heading">{{ km() ? 'ការទូទាត់' : 'Payment method' }}</h2><div class="payment-choice"><span>◉</span><div><strong>{{ km() ? 'ទូទាត់នៅពេលទទួលទំនិញ' : 'Pay on delivery / in store' }}</strong><small>{{ km() ? 'ការបញ្ជាទិញនេះជាគំរូសម្រាប់គម្រោងសិក្សា។' : 'Demo checkout only — no payment is collected.' }}</small></div></div><button class="button button-primary full-button" type="submit">{{ km() ? 'ដាក់ការបញ្ជាទិញ' : 'Place demo order' }} <span class="arrow-icon" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M4 12 12 4M5 4h7v7" /></svg></span></button><a routerLink="/cart" class="continue-link">← {{ km() ? 'ត្រឡប់ទៅកន្ត្រក' : 'Back to cart' }}</a></form><aside class="summary-card"><h2>{{ km() ? 'ការបញ្ជាទិញ' : 'Your order' }}</h2>@for(item of cart.detailedItems();track item.product.id){<div class="checkout-line"><span>{{ item.quantity }} × {{ item.product.model }}</span><strong>{{ prefs.price(item.product.priceUsd*item.quantity) }}</strong></div>}<div class="summary-total"><span>{{ km() ? 'សរុប' : 'Total' }}</span><strong>{{ prefs.price(cart.subtotal()) }}</strong></div></aside></div>}
    @else {<div class="empty-cart"><h2>{{ km() ? 'កន្ត្រកទទេ' : 'Nothing to check out yet.' }}</h2><a routerLink="/" class="button button-primary">{{ km() ? 'មើលកុំព្យូទ័រ' : 'Browse laptops' }} ↗︎</a></div>}
  </section>
`})
export class CheckoutComponent {
  private fb=inject(FormBuilder); private router=inject(Router); readonly cart=inject(CartService); readonly prefs=inject(PreferencesService);
  readonly form=this.fb.nonNullable.group({name:['',[Validators.required,Validators.minLength(2)]],phone:['',[Validators.required,Validators.minLength(7)]],email:['',[Validators.email]],address:['',[Validators.required,Validators.minLength(8)]]});
  km():boolean{return this.prefs.language()==='km';}
  invalid(field:'name'|'phone'|'email'|'address'):boolean{const control=this.form.controls[field];return control.invalid && (control.dirty || control.touched);}
  placeOrder():void {
    this.form.markAllAsTouched(); if(this.form.invalid || !this.cart.detailedItems().length) return;
    const order={number:`SV3-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${Math.floor(1000+Math.random()*9000)}`,date:new Date().toLocaleDateString('en-GB'),customer:this.form.getRawValue(),items:this.cart.detailedItems().map(item=>({name:`${item.product.brand} ${item.product.model}`,quantity:item.quantity,priceUsd:item.product.priceUsd})),subtotalUsd:this.cart.subtotal(),currency:this.prefs.currency()};
    sessionStorage.setItem('sv3-last-order',JSON.stringify(order)); this.cart.clear(); void this.router.navigateByUrl('/invoice');
  }
}
