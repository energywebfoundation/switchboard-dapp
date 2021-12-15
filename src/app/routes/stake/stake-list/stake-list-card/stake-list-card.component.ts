import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stake-list-card',
  templateUrl: './stake-list-card.component.html',
  styleUrls: ['./stake-list-card.component.scss']
})
export class StakeListCardComponent {
  @Input() organization: string;
  @Input() logoUrl: string;
  @Input() providerDate: string;
  @Input() stakeAmount: number;
  @Input() stakeRating = 0;
  @Input() activeServices: number;
  @Input() numberOfNodes: number;
  @Input() isAcceptingPatrons: boolean;

  constructor() {
  }

}
