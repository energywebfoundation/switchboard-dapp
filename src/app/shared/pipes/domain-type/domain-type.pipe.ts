import { Pipe, PipeTransform } from '@angular/core';
import { DomainTypeEnum } from '../../../routes/applications/new-role/new-role.component';

const domainTypeMap = new Map<DomainTypeEnum, string>()
  .set(DomainTypeEnum.APP, 'Application')
  .set(DomainTypeEnum.CUSTOM, 'Custom')
  .set(DomainTypeEnum.ORG, 'Organization');

@Pipe({
  name: 'domainType',
})
export class DomainTypePipe implements PipeTransform {
  transform(value: DomainTypeEnum): unknown {
    if (domainTypeMap.has(value)) {
      return domainTypeMap.get(value);
    }
    return 'Unsupported Domain Type';
  }
}
