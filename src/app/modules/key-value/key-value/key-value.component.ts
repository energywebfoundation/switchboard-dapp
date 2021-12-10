import { Component, EventEmitter, Output } from '@angular/core';
import { KeyValue } from '../key-value.interface';

@Component({
  selector: 'app-key-value',
  templateUrl: './key-value.component.html',
  styleUrls: ['./key-value.component.scss']
})
export class KeyValueComponent {
  @Output() updatedList = new EventEmitter();
  formVisible = false;
  pairsList: KeyValue[] = [];

  showForm(): void {
    this.formVisible = true;
  }

  hideForm(): void {
    this.formVisible = false;
  }

  hasListElements(): boolean {
    return this.pairsList.length > 0;
  }

  addHandler(pair: KeyValue): void {
    this.hideForm();
    this.updateList([...this.pairsList, pair]);
  }

  removeHandler(index: number): void {
    const list = this.pairsList;
    list.splice(index, 1);
    this.updateList(list);
  }

  private updateList(list: KeyValue[]) {
    this.pairsList = [...list];
    this.updatedList.emit(this.pairsList);
  }

}
