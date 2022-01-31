import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ENSPrefixes, RoleTypeEnum } from '../../new-role.component';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { isAlphanumericValidator, StringTransform } from '@utils';
import { RoleCreationService } from '../../services/role-creation.service';
import { from } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { CreationBaseAbstract } from '../../../utils/creation-base.abstract';

@Component({
  selector: 'app-role-name',
  templateUrl: './role-name.component.html',
  styleUrls: ['./role-name.component.scss'],
})
export class RoleNameComponent extends CreationBaseAbstract {
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

  constructor(private roleCreationService: RoleCreationService) {
    super();
  }

  get ensNamespace(): string {
    return (
      this.form.value + '.' + ENSPrefixes.Roles + '.' + this.parentNamespace
    );
  }

  parseValue(form: AbstractControl, value: string): void {
    form.patchValue(StringTransform.removeWhiteSpaces(value.toLowerCase()), {
      emitEvent: false,
    });
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
