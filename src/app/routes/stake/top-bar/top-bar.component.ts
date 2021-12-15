import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  @Input() provider: string;
  @Input() providerLogo: string;

  constructor(private router: Router) {
  }

  providersList() {
    this.router.navigate(['stake']);
  }
}
