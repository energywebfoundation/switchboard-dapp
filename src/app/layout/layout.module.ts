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
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

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
    BsDropdownModule,
  ],
  providers: [],
  declarations: [
    LayoutComponent,
    HeaderComponent,
    DialogUserComponent,
    LoadingComponent,
  ],
  entryComponents: [DialogUserComponent],
  exports: [LayoutComponent, HeaderComponent, LoadingComponent],
})
export class LayoutModule {}
