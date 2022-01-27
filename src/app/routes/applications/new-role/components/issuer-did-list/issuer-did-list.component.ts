import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-issuer-did-list',
  templateUrl: './issuer-did-list.component.html',
  styleUrls: ['./issuer-did-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssuerDidListComponent {
  @Input() list: string[];
  @Output() remove = new EventEmitter<number>();

  removeDid(id: number) {
    this.remove.emit(id);
  }
}
