import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowRawDataDirective } from './directive/show-raw-data.directive';
import { RawDataComponent } from './components/raw-data/raw-data.component';
import { RawDataDialogComponent } from './components/raw-data-dialog/raw-data-dialog.component';



@NgModule({
  declarations: [
    ShowRawDataDirective,
    RawDataComponent,
    RawDataDialogComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ShowRawDataDirective,
    RawDataComponent
  ]
})
export class RawDataModule { }
