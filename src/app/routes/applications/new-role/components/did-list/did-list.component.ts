import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-did-list',
  templateUrl: './did-list.component.html',
  styleUrls: ['./did-list.component.scss'],
})
export class DidListComponent {
  @Input() list: string[];
  @Output() remove = new EventEmitter<string>();

  removeDid(id: string) {
    this.remove.emit(id);
  }
}
