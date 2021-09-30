import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectedNetworkComponent } from './connected-network/connected-network.component';
import { UserDidComponent } from './user-did/user-did.component';
import { UserNameComponent } from './user-name/user-name.component';
import { MatIconModule } from '@angular/material/icon';
import { CopyToClipboardModule } from '../../../shared/directives/copy-to-clipboard/copy-to-clipboard.module';
import { DidFormatMinifierModule } from '../../../shared/pipes/did-format-minifier/did-format-minifier.module';


@NgModule({
  declarations: [
    ConnectedNetworkComponent,
    UserDidComponent,
    UserNameComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    CopyToClipboardModule,
    DidFormatMinifierModule,
  ],
  exports: [
    ConnectedNetworkComponent,
    UserDidComponent,
    UserNameComponent
  ]
})
export class UserMenuModule {
}
