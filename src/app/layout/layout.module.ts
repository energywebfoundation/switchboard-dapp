import { NgModule } from '@angular/core';
import { UserIdleModule } from 'angular-user-idle';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NavsearchComponent } from './header/navsearch/navsearch.component';
import { OffsidebarComponent } from './offsidebar/offsidebar.component';
import { UserblockComponent } from './sidebar/userblock/userblock.component';
import { UserblockService } from './sidebar/userblock/userblock.service';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { DialogUserComponent } from './header/dialog-user/dialog-user.component';
import { LoadingComponent } from './loading/loading.component';
import { NgxSpinnerModule } from 'ngx-spinner';

import { environment } from '../../environments/environment';
import { MatDialogModule } from '@angular/material/dialog';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  imports: [
    SharedModule,
    MatDialogModule,
    MatMenuModule,
    NgxSpinnerModule,
    ClipboardModule,
    UserIdleModule.forRoot({idle: environment.userIdle, timeout: environment.userIdle})
  ],
  providers: [
    UserblockService
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    UserblockComponent,
    HeaderComponent,
    NavsearchComponent,
    OffsidebarComponent,
    FooterComponent,
    DialogUserComponent,
    LoadingComponent
  ],
  entryComponents: [DialogUserComponent],
  exports: [
    LayoutComponent,
    SidebarComponent,
    UserblockComponent,
    HeaderComponent,
    NavsearchComponent,
    OffsidebarComponent,
    FooterComponent,
    LoadingComponent
  ]
})
export class LayoutModule {
}
