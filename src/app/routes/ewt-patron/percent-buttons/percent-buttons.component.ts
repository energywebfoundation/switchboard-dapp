import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-percent-buttons',
  templateUrl: './percent-buttons.component.html',
  styleUrls: ['./percent-buttons.component.scss']
})
export class PercentButtonsComponent {
  percentButtons = [25, 50, 75, 100];
  selectedPercentButton;
  @Output() percent = new EventEmitter<number>();

  percentHandler(percent: number) {
    this.selectedPercentButton = percent;
    this.percent.emit(percent);
  }
}
