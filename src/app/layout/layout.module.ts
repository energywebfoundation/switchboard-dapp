import { NgModule } from '@angular/core';
import { UserIdleModule } from 'angular-user-idle';

import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { DialogUserComponent } from './header/dialog-user/dialog-user.component';
import { LoadingComponent } from './loading/loading.component';
import { NgxSpinnerModule } from 'ngx-spinner';

import { environment } from '../../environments/environment';
import { MatDialogModule } from '@angular/material/dialog';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { UserMenuModule } from './components/user-menu/user-menu.module';
import { DidBookModule } from '../modules/did-book/did-book.module';
import { UserNotificationsComponent } from './header/user-notifications/user-notifications.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  imports: [
    SharedModule,
    MatDialogModule,
    MatMenuModule,
    NgxSpinnerModule,
    ClipboardModule,
    UserIdleModule.forRoot({
      idle: environment.userIdle,
      timeout: environment.userIdle,
    }),
    UserMenuModule,
    DidBookModule.forRoot(),
    MatBadgeModule,
  ],
  providers: [],
  declarations: [
    LayoutComponent,
    HeaderComponent,
    DialogUserComponent,
    LoadingComponent,
    UserNotificationsComponent,
  ],
  entryComponents: [DialogUserComponent],
  exports: [LayoutComponent, HeaderComponent, LoadingComponent],
})
export class LayoutModule {}
