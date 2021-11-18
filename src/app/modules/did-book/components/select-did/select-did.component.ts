import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HexValidators } from '../../../../utils/validators/is-hex/is-hex.validator';
import { DidBookService } from '../../services/did-book.service';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddSingleRecordComponent } from '../add-single-record/add-single-record.component';

@Component({
  selector: 'app-select-did',
  templateUrl: './select-did.component.html',
  styleUrls: ['./select-did.component.scss']
})
export class SelectDidComponent implements OnInit {
  @Output() didChange = new EventEmitter<{ did: string, valid: boolean }>();

  didBook$;
  newOwnerDID = new FormControl('', [Validators.required, HexValidators.isDidValid()]);
  isNotKnownDid: boolean;

  constructor(private didBookServ: DidBookService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.didBook$ = combineLatest([this.didBookServ.getList$(), this.newOwnerDID.valueChanges.pipe(startWith(''))])
      .pipe(map(([list, value]) => {
          const filteredList = list.filter(el =>
            el.did.toLowerCase().includes(value.toLowerCase()) || el.label.toLowerCase().includes(value.toLowerCase())
          );
          this.isNotKnownDid = filteredList.length === 0;
          return filteredList;
        })
      );

    this.newOwnerDID.valueChanges
      .subscribe((did) => {
        this.didChange.emit({did, valid: this.newOwnerDID.valid});
      });
  }

  approveHandler() {
    this.dialog.open(AddSingleRecordComponent, {
      width: '550px',
      data: {did: this.newOwnerDID.value}
    });
  }

}
