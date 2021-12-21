import { Pipe, PipeTransform } from '@angular/core';
import { RoleTypeEnum } from '../new-role.component';

@Pipe({
  name: 'roleType'
})
export class RoleTypePipe implements PipeTransform {

  transform(value: RoleTypeEnum, ...args: unknown[]): unknown {
    return value === RoleTypeEnum.ORG ? 'Organization' : 'Application';
  }

}
