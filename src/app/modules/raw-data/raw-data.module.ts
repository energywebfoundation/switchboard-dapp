import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowRawDataDirective } from './directive/show-raw-data.directive';
import { RawDataComponent } from './components/raw-data/raw-data.component';
import { RawDataDialogComponent } from './components/raw-data-dialog/raw-data-dialog.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { CopyToClipboardModule } from '../../shared/directives/copy-to-clipboard/copy-to-clipboard.module';

@NgModule({
  declarations: [
    ShowRawDataDirective,
    RawDataComponent,
    RawDataDialogComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CopyToClipboardModule,
  ],
  exports: [ShowRawDataDirective, RawDataComponent],
})
export class RawDataModule {}
