import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { IssuerType } from '../../models/issuer-type.enum';
import { RoleStepType } from '../../models/role-step.type';
import { IRoleType } from '../../models/role-type.interface';

@Component({
  selector: 'app-set-role-type-dids-or-name',
  templateUrl: './set-role-type-dids-or-name.component.html',
  styleUrls: ['./set-role-type-dids-or-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetRoleTypeDidsOrNameComponent implements OnInit {
  @Input() roleType: RoleStepType = 'Issuer';
  @Input() set typeDefinition(value: IRoleType) {
    if (!value) {
      return;
    }
    this.list = [...value.did];
    this.form.setValue({
      type: value.type,
      roleName: value.roleName ?? '',
    });
  }
  @Input() signerDID: string;
  @Input() showBackButton = false;
  @Input() showCancelButton = false;
  @Output() next = new EventEmitter<IRoleType>();
  @Output() cancel = new EventEmitter();
  @Output() back = new EventEmitter();
  form = this.fb.group({
    type: IssuerType.DID,
    roleName: '',
  });
  roleTypes = [IssuerType.DID, IssuerType.ROLE];

  list: string[] = [];

  constructor(private fb: FormBuilder) {}

  typeChanged(): void {
    if (this.list.length > 0) {
      this.list.splice(0, this.list.length);
    }

    this.roleName.reset();

    this.setDefaultDID();
  }

  ngOnInit(): void {
    if (this.list.length === 0) {
      this.setDefaultDID();
    }
  }

  get isDIDType() {
    return this.type === IssuerType.DID;
  }

  get roleName() {
    return this.form.get('roleName') as FormControl;
  }

  get isRoleType() {
    return this.type === IssuerType.ROLE;
  }

  onNextHandler() {
    this.next.emit({
      type: this.type,
      did: this.list,
      roleName: this.form?.value?.roleName ?? '',
    });
  }

  private get type() {
    return this.form?.value?.type;
  }

  private setDefaultDID() {
    if (this.type === IssuerType.DID) {
      this.list = [this.signerDID];
    }
  }
}
