import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../../utils/validators/is-hex/is-hex.validator';

@Component({
  selector: 'app-did-book-form',
  templateUrl: './did-book-form.component.html',
  styleUrls: ['./did-book-form.component.scss']
})
export class DidBookFormComponent implements OnInit {
  @Input() data;
  @Output() add = new EventEmitter();
  @Output() cancel = new EventEmitter();

  form = this.fb.group({
    name: ['', [Validators.required]],
    did: ['', [Validators.required, HexValidators.isDidValid()]]
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

}
