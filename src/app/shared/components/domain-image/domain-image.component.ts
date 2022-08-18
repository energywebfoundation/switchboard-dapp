import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-domain-image',
  templateUrl: './domain-image.component.html',
  styleUrls: ['./domain-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomainImageComponent {
  @Input() url: string;
  @Input() type: 'Org' | 'App';

  @Output() imageLoaded = new EventEmitter<boolean>();

  imageEventHandler(value: boolean): void {
    this.imageLoaded.emit(value);
  }

  get defaultUrl(): string {
    return `../assets/img/no-${this.type.toLowerCase()}-image.png`;
  }
}
