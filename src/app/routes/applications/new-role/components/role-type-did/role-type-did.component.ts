import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HexValidators, ListValidator } from '@utils';
import { RoleStepTypeEnum } from '../../models/role-step-type.enum';

@Component({
  selector: 'app-role-type-did',
  templateUrl: './role-type-did.component.html',
  styleUrls: ['./role-type-did.component.scss'],
})
export class RoleTypeDidComponent {
  @Input() type: RoleStepTypeEnum = RoleStepTypeEnum.Issuer;
  @Input() set dids(value: string[]) {
    this._list = value;
    this.setValidators();
  }

  form = new FormControl('', [HexValidators.isDidValid()]);

  get list() {
    return this._list;
  }

  private _list: string[] = [];

  addDid() {
    if (this.form.invalid) {
      return;
    }
    this._list.push(this.form.value);
    this.form.reset();
  }

  remove(id) {
    if (this.list.length > 1) {
      this.list.splice(id, 1);
    }
  }

  private setValidators(): void {
    this.form.setValidators([
      HexValidators.isDidValid(),
      ListValidator.stringExist(this.list),
    ]);
  }
}
