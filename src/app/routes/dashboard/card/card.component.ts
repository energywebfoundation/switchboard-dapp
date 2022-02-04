import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnInit {
  @Input() image: string;
  @Input() title: string;
  @Input() comingSoon = false;
  @Input() isExperimental: boolean;
  iconUrl: string;

  ngOnInit(): void {
    this.buildIconUrl();
  }

  buildIconUrl() {
    this.iconUrl = `/assets/img/icons/${this.image}`;
  }
}
