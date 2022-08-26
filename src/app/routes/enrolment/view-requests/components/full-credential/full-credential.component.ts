import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-credential-json',
  templateUrl: './full-credential.component.html',
  styleUrls: ['./full-credential.component.scss'],
})
export class CredentialJsonComponent {
  @Input() title: string;
  @Input() credentialData: object;
  panelOpenState = false;
}
