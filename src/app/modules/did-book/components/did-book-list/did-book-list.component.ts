import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DidBookRecord } from '../models/did-book-record';

@Component({
  selector: 'app-did-book-list',
  templateUrl: './did-book-list.component.html',
  styleUrls: ['./did-book-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DidBookListComponent {
  @Input() set list(value: DidBookRecord[]) {
    if (!value) {
      return;
    }

    this.data = value;
  }

  get list() {
    return this.data;
  }

  @Output() delete = new EventEmitter<string>();

  displayedColumns = ['label', 'did', 'actions'];
  private data: DidBookRecord[] = [];

  remove(id: string) {
    this.delete.emit(id);
  }
}
