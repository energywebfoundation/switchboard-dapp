import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HexValidators } from '@utils';
import { DidBookService } from '../../services/did-book.service';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddSingleRecordComponent } from '../add-single-record/add-single-record.component';
import { ListValidator } from '@utils';
import { DidBookRecord } from '../models/did-book-record';

@Component({
  selector: 'app-select-did',
  templateUrl: './select-did.component.html',
  styleUrls: ['./select-did.component.scss'],
})
export class SelectDidComponent implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() isRequired = false;
  @Input() showAddButton: boolean;
  @Input() set didToRemove(list: string[]) {
    this._didToRemove = list;
    this.setValidators();
    this.setDIDBookList();
  }
  get didToRemove() {
    return this._didToRemove;
  }
  @Output() didChange = new EventEmitter<{ did: string; valid: boolean }>();
  @Output() add = new EventEmitter<string>();

  didBook$: Observable<DidBookRecord[]>;
  newDID = new FormControl('', [HexValidators.isDidValid()]);
  isNotKnownDid = false;
  private _didToRemove: string[] = [];

  constructor(private didBookServ: DidBookService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.setValidators();
    this.setDIDBookList();

    this.newDID.valueChanges.subscribe((did) => {
      this.didChange.emit({ did, valid: this.newDID.valid });
    });
  }

  setValidators(): void {
    if (!this.isRequired) {
      this.newDID.setValidators([...this.defaultValidators()]);
      return;
    }
    this.newDID.setValidators([
      Validators.required,
      ...this.defaultValidators(),
    ]);
  }

  approveHandler(): void {
    this.dialog.open(AddSingleRecordComponent, {
      width: '550px',
      data: { did: this.newDID.value },
    });
  }

  addDid(event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.newDID.invalid || !this.newDID.value) {
      return;
    }

    this.add.emit(this.newDID.value);
    this.newDID.reset('');
  }

  private setDIDBookList(): void {
    this.didBook$ = combineLatest([
      this.didBookServ.getList$(),
      this.newDID.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([list, value]) => {
        const filteredList = list
          .filter((item) => !this.didToRemove.includes(item.did))
          .filter(
            (el) =>
              el.did.toLowerCase().includes(value.toLowerCase()) ||
              el.label.toLowerCase().includes(value.toLowerCase())
          );
        this.isNotKnownDid = filteredList.length === 0;
        return filteredList;
      })
    );
  }

  private defaultValidators() {
    return [
      HexValidators.isDidValid(),
      ListValidator.stringExist(this.didToRemove),
    ];
  }
}
