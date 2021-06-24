import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-provider-name',
  templateUrl: './provider-name.component.html',
  styleUrls: ['./provider-name.component.scss']
})
export class ProviderNameComponent {
  @Input() name;
  @Input() since: string;
  @Input() logo: string;

}
