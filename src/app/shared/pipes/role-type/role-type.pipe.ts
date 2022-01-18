import { Pipe, PipeTransform } from '@angular/core';
import { RoleTypeEnum } from '../../../routes/applications/new-role/new-role.component';

const roleTypeMap = new Map<RoleTypeEnum, string>()
  .set(RoleTypeEnum.APP, 'Application')
  .set(RoleTypeEnum.CUSTOM, 'Custom')
  .set(RoleTypeEnum.ORG, 'Organization');

@Pipe({
  name: 'roleType'
})
export class RoleTypePipe implements PipeTransform {

  transform(value: RoleTypeEnum, ...args: unknown[]): unknown {
    if (roleTypeMap.has(value)) {
      return roleTypeMap.get(value);
    }
    return 'Unsupported Role Type';
  }

}
