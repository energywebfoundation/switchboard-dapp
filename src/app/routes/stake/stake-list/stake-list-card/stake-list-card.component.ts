import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stake-list-card',
  templateUrl: './stake-list-card.component.html',
  styleUrls: ['./stake-list-card.component.scss']
})
export class StakeListCardComponent implements OnInit {
  @Input() organization: string;
  @Input() organizationImage: string;
  @Input() providerDate: string;
  @Input() stakeAmount: number;
  @Input() stakeRating: number;
  @Input() activeServices: number;
  @Input() numberOfNodes: number;
  @Input() isAcceptingPatrons: Boolean;

  constructor() { }

  ngOnInit(): void {
  }

  getStakeRatingText(stakeRating: number = this.stakeRating || 0){
    if (stakeRating <= 25) {
      return `${stakeRating}% (Bad)`;
    }

    if (stakeRating >= 26 && stakeRating <= 50) {
      return `${stakeRating}% (Fair)`;
    }

    if (stakeRating >= 51 && stakeRating <= 75) {
      return `${stakeRating}% (Good)`;
    }

    if (stakeRating >= 76) {
      return `${stakeRating}% (Excellent)`;
    }

  }

  getStakeRatingClass(stakeRating: number = this.stakeRating || 0){
    if (stakeRating <= 25) {
      return 'card-progress-bad';
    }

    if (stakeRating >= 26 && stakeRating <= 50) {
      return 'card-progress-fair';
    }

    if (stakeRating >= 51 && stakeRating <= 75) {
      return 'card-progress-good';
    }

    if (stakeRating >= 76) {
      return 'card-progress-excellent';
    }

  }

}
