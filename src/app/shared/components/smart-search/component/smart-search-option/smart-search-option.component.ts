import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IAppDefinition, IOrganizationDefinition } from 'iam-client-lib';

@Component({
  selector: 'app-smart-search-option',
  templateUrl: './smart-search-option.component.html',
  styleUrls: ['./smart-search-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartSearchOptionComponent {
  @Input() definition: IAppDefinition & IOrganizationDefinition;
  @Input() namespace: string;

  get isDefinitionDefined() {
    return Boolean(this.definition?.appName || this.definition?.orgName);
  }
}
