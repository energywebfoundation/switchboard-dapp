import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-issuer-field-form',
  templateUrl: './issuer-field-form.component.html',
  styleUrls: ['./issuer-field-form.component.scss']
})
export class IssuerFieldFormComponent implements OnInit {
  @Input() data;
  @Output() added = new EventEmitter();
  @Output() updated = new EventEmitter();
  @Output() canceled = new EventEmitter();

  editMode = false;
  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    pattern: ['']
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.setData();
  }

  cancel() {
    this.canceled.emit();
  }

  add() {
    if (this.form.invalid) {
      return;
    }
    this.added.emit(this.form.value);
  }

  update() {
    if (this.form.invalid) {
      return;
    }
    this.updated.emit(this.form.value);
  }

  private setData() {
    if (this.data) {
      this.editMode = true;
      this.form.patchValue(this.data);
    }
  }
}
