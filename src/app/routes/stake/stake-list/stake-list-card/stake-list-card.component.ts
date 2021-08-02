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
  @Input() stakeRating = 0;
  @Input() activeServices: number;
  @Input() numberOfNodes: number;
  @Input() isAcceptingPatrons: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
