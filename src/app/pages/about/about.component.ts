import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PreferencesService } from '../../services/preferences.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="team-section about-page" id="about">
      <div class="container">
        <a class="back-link" routerLink="/">← {{ km() ? 'ត្រឡប់ទៅទំនិញ' : 'Back to shop' }}</a>
        <div class="team-heading about-heading">
          <div>
            <div class="eyebrow dark-eyebrow">{{ km() ? 'ក្រុមការងារ SV3' : 'THE PEOPLE BEHIND THE PROJECT' }}</div>
            <h1>{{ km() ? 'ជួបសមាជិកក្រុម' : 'Meet our team.' }}</h1>
            <p>{{ km() ? 'ពួកយើងជានិស្សិតឆ្នាំទី៤ ឆមាសទី១ នៅវិទ្យាស្ថាន SETEC រាជធានីភ្នំពេញ។ គម្រោងនេះជាការអនុវត្តជាក់ស្តែងលើការរចនា និងអភិវឌ្ឍហាងលក់កុំព្យូទ័រតាមអនឡាញ។' : 'We are fourth-year, first-semester students at SETEC Institute in Phnom Penh. This midterm project applies our skills in designing and developing a laptop e-commerce website.' }}</p>
          </div>
          <span class="team-count">04 <small>{{ km() ? 'សមាជិក' : 'MEMBERS' }}</small></span>
        </div>
        <div class="team-grid">
          @for (member of team; track member.name) {
            <article class="team-card">
              <div class="team-card-top">@if (member.photo) { <img class="team-avatar team-photo" [src]="member.photo" [alt]="member.name + ' profile photo'"> } @else { <span class="team-avatar">{{ member.initials }}</span> }<span class="team-number">{{ member.number }}</span></div>
              <div class="team-card-bottom">
                <span class="team-role">{{ km() ? 'តួនាទីក្នុងគម្រោង' : 'PROJECT RESPONSIBILITY' }}</span>
                <h2>{{ member.name }}</h2>
                <p class="member-responsibility">{{ km() ? member.roleKm : member.role }}</p>
                <div class="member-study">
                  <strong>{{ km() ? 'និស្សិតឆ្នាំទី៤ · ឆមាសទី១' : 'Year 4 · Semester 1' }}</strong>
                  <span>{{ km() ? 'វិទ្យាស្ថាន SETEC · រាជធានីភ្នំពេញ' : 'SETEC Institute · Phnom Penh' }}</span>
                </div>
                <span class="team-caption">SV3 COMPUTER · MIDTERM PROJECT</span>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `
})
export class AboutComponent {
  private readonly preferences = inject(PreferencesService);
  readonly team: { name: string; initials: string; photo?: string; number: string; role: string; roleKm: string }[] = [
    { name: 'Khouen Menghor', initials: 'KM', photo: '/images/team/khouen-menghor.png', number: '01', role: 'Home Page & Product Catalog', roleKm: 'ទំព័រដើម និងកាតាឡុកផលិតផល' },
    { name: 'Kong Thach', initials: 'KT', photo: '/images/team/kong-thach.png', number: '02', role: 'Product Details & Add to Cart', roleKm: 'ព័ត៌មានលម្អិតផលិតផល និងបន្ថែមទៅកន្ត្រក' },
    { name: 'Neat Chanthy', initials: 'NC', photo: '/images/team/neat-chanthy.jpg', number: '03', role: 'Cart & Checkout', roleKm: 'កន្ត្រក និងការបញ្ជាទិញ' },
    { name: 'Hok Vouchleang', initials: 'HV', photo: '/images/team/hok-vouchleang.png', number: '04', role: 'HTML Invoice & Project Documentation', roleKm: 'វិក្កយបត្រ HTML និងឯកសារគម្រោង' }
  ];

  km(): boolean { return this.preferences.language() === 'km'; }
}
