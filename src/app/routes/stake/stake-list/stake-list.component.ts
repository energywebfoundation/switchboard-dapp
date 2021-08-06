import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stake-list',
  templateUrl: './stake-list.component.html',
  styleUrls: ['./stake-list.component.scss']
})
export class StakeListComponent {

  mockData = [
    {
      organization: 'Energy Web Foundation',
      organizationImage: 'ew-flex-single-logo.png',
      providerDate: 'April, 2017',
      stakeAmount: '2222.2222',
      stakeRating: '97',
      activeServices: '1',
      numberOfNodes: '1',
      isAcceptingPatrons: true
    }
  ];

  constructor(private router: Router) {
  }

  goToDetails() {
    this.router.navigateByUrl('/staking?org=energyweb.iam.ewc');
  }
}
