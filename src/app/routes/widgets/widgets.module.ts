import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatButtonModule, MatPaginatorModule, MatIconModule, MatTooltipModule, MatInputModule, MatTableModule, MatDialogModule, MatFormFieldModule, MatDatepickerModule, MatTabsModule, MatSelectModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatNativeDatetimeModule, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

const routes: Routes = [

];

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDatetimeModule,
    MatDatetimepickerModule
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],

  exports: [
    RouterModule,
  ]
})
export class WidgetsModule { }

