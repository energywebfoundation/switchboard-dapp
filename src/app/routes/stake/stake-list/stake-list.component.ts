import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as StakeActions from '../../../state/stake/stake.actions';
import * as stakeSelectors from '../../../state/stake/stake.selectors';

@Component({
  selector: 'app-stake-list',
  templateUrl: './stake-list.component.html',
  styleUrls: ['./stake-list.component.scss']
})
export class StakeListComponent implements OnInit {
  providersList$ = this.store.select(stakeSelectors.getProviders);
  constructor(private router: Router, private store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(StakeActions.getAllServices());
  }

  goToDetails(org: string): void {
    window.open(`/staking?org=${org}`);
  }
}
