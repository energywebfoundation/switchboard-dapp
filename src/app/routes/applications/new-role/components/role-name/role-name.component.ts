import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isAlphaNumericOnly } from '../../../../../utils/functions/is-alpha-numeric';
import { ENSPrefixes, RoleTypeEnum } from '../../new-role.component';
import { FormControl, Validators } from '@angular/forms';
import { isAlphanumericValidator } from '../../../../../utils/validators/is-alphanumeric.validator';
import { RoleCreationService } from '../../services/role-creation.service';
import { from } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-role-name',
  templateUrl: './role-name.component.html',
  styleUrls: ['./role-name.component.scss'],
})
export class RoleNameComponent {
  @Input() roleType: RoleTypeEnum;
  @Input() parentNamespace: string;

  @Output() proceed = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<{ touched: boolean }>();

  form = new FormControl(
    '',
    [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(256),
      isAlphanumericValidator,
    ],
    [this.canUseDomain()]
  );

  constructor(private roleCreationService: RoleCreationService) {}

  get ensNamespace(): string {
    return (
      this.form.value + '.' + ENSPrefixes.Roles + '.' + this.parentNamespace
    );
  }

  controlHasError(errorType: string): boolean {
    return this.form.hasError(errorType);
  }

  cancelHandler(): void {
    this.cancel.emit({ touched: this.form.touched });
  }

  canUseDomain() {
    return () => {
      return from(
        this.roleCreationService.canUseDomain(this.ensNamespace)
      ).pipe(
        debounceTime(300),
        map((res) => (res ? null : { domainExist: true }))
      );
    };
  }

  async next(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    this.proceed.emit(this.form.value);
  }
}
