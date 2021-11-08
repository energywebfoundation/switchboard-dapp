import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HexValidators } from '../../../../utils/validators/is-hex/is-hex.validator';
import { DidBookService } from '../../services/did-book.service';

@Component({
  selector: 'app-select-did',
  templateUrl: './select-did.component.html',
  styleUrls: ['./select-did.component.scss']
})
export class SelectDidComponent implements OnInit {
  @Output() didChange = new EventEmitter<{ did: string, valid: boolean }>();

  didBook$ = this.didBookServ.list$;
  newOwnerDID = new FormControl('', [Validators.required, HexValidators.isDidValid()]);

  constructor(private didBookServ: DidBookService) {
  }

  ngOnInit(): void {
    this.newOwnerDID.valueChanges
      .subscribe((did) => {
        this.didChange.emit({did, valid: this.newOwnerDID.valid});
      });
  }

}
