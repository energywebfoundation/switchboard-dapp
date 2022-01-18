import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HexValidators, ListValidator } from '@utils';

@Component({
  selector: 'app-issuer-did',
  templateUrl: './issuer-did.component.html',
  styleUrls: ['./issuer-did.component.scss']
})
export class IssuerDidComponent {
  @Input() set issuerList(value: string[]) {
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

  removeIssuer(id) {
    if (this.list.length > 1) {
      this.list.splice(id, 1);
    }
  }

  private setValidators(): void {
    this.form.setValidators([HexValidators.isDidValid(), ListValidator.stringExist(this.list)]);
  }

}
