import { Component, OnInit } from '@angular/core';
import { PatronService } from '../patron.service';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as stakeSelectors from '../../../state/stake/stake.selectors';

@Component({
  selector: 'app-ewt-patron',
  templateUrl: './ewt-patron.component.html',
  styleUrls: ['./ewt-patron.component.scss']
})
export class EwtPatronComponent implements OnInit {
  balance$ = this.store.select(stakeSelectors.getBalance);
  performance$ = this.store.select(stakeSelectors.getPerformance);
  annualReward$ = this.store.select(stakeSelectors.getAnnualReward);

  constructor(private patronService: PatronService, private store: Store<StakeState>) {
  }

  launch() {
    this.patronService.launch();
  }

  services() {
    this.patronService.services();
  }

  ngOnInit() {
    this.patronService.init();
  }

}
