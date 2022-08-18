import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-vp-header',
  templateUrl: './vp-header.component.html',
  styleUrls: ['./vp-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VpHeaderComponent {}
