import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HexValidators, ListValidator } from '@utils';
import { RoleStepType } from '../../models/role-step.type';

@Component({
  selector: 'app-role-type-did',
  templateUrl: './role-type-did.component.html',
  styleUrls: ['./role-type-did.component.scss'],
})
export class RoleTypeDidComponent {
  @Input() type: RoleStepType;
  @Input() set dids(value: string[]) {
    this._list = value;
  }

  get list(): string[] {
    return this._list;
  }
  private _list: string[] = [];

  add(did: string): void {
    this._list.push(did);
  }

  remove(did: string): void {
    this._list = this.list.filter((item) => item !== did);
  }
}
