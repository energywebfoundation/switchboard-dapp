import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DidBookService } from '../../services/did-book.service';

@Component({
  selector: 'app-did-book',
  templateUrl: './did-book.component.html',
  styleUrls: ['./did-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DidBookComponent {

  list$ = this.didBookService.list$;

  constructor(private didBookService: DidBookService) {
  }

  addHandler(record) {
    this.didBookService.add(record);
  }

  delete(id: string) {
    this.didBookService.delete(id);
  }
}
