import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() rating = 0;
  @HostBinding('class') stakeClasses: string;
  @Input() size: 'long' | 'short' = 'long';
  ratingText: string;

  ngOnInit(): void {
    this.setStakeClasses();
    this.ratingText = this.getStakeRatingText(this.rating);
  }

  getStakeRatingText(stakeRating: number) {
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

  getStakeRatingClass(stakeRating: number) {
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

  setStakeClasses() {
      this.stakeClasses = `${this.getStakeRatingClass(this.rating)} ${this.size}`;
  }

}
