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
            <p>{{ km() ? 'អ្នកបង្កើតគម្រោងហាងកុំព្យូទ័រ SV3។' : 'The team building the SV3 Computer experience.' }}</p>
          </div>
          <span class="team-count">04 <small>{{ km() ? 'សមាជិក' : 'MEMBERS' }}</small></span>
        </div>
        <div class="team-grid">
          @for (member of team; track member.name) {
            <article class="team-card">
              <div class="team-card-top">@if (member.photo) { <img class="team-avatar team-photo" [src]="member.photo" [alt]="member.name + ' profile photo'"> } @else { <span class="team-avatar">{{ member.initials }}</span> }<span class="team-number">{{ member.number }}</span></div>
              <div class="team-card-bottom">
                <span class="team-role">{{ km() ? 'សមាជិកក្រុមគម្រោង' : 'PROJECT TEAM MEMBER' }}</span>
                <h2>{{ member.name }}</h2>
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
  readonly team: { name: string; initials: string; photo?: string; number: string }[] = [
    { name: 'Khouen Menghor', initials: 'KM', photo: '/images/team/khouen-menghor.png', number: '01' },
    { name: 'Kong Thach', initials: 'KT', photo: '/images/team/kong-thach.png', number: '02' },
    { name: 'Neat Chanthy', initials: 'NC', photo: '/images/team/neat-chanthy.jpg', number: '03' },
    { name: 'Hok Vouchleang', initials: 'HV', photo: '/images/team/hok-vouchleang.png', number: '04' }
  ];

  km(): boolean { return this.preferences.language() === 'km'; }
}
