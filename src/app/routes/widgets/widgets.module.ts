import { NgModule, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';


import { MatButtonModule, MatPaginatorModule, MatIconModule, MatTooltipModule, MatInputModule, MatTableModule, MatDialogModule, MatFormFieldModule, MatDatepickerModule, MatTabsModule, MatSelectModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartsModule as Ng2ChartsModule } from 'ng2-charts/ng2-charts';
import { ChartsModule } from '@progress/kendo-angular-charts';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatNativeDatetimeModule, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { QRCodeModule } from 'angular2-qrcode';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

const routes: Routes = [

];

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [
    SharedModule,
    CommonModule,
    ChartsModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    Ng2ChartsModule,
    MatFormFieldModule,
    ChartsModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatNativeDatetimeModule,
    MatDatetimepickerModule,    
    QRCodeModule
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],

  exports: [
    RouterModule,
  ]
})
export class WidgetsModule { }

