import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { QrCodeScannerModule } from '../../shared/components/qr-code-scanner/qr-code-scanner.module';
import { CascadingFilterComponent } from './components/cascading-filter/cascading-filter.component';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

@NgModule({
  declarations: [CascadingFilterComponent],
  imports: [
    MatSelectModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    QrCodeScannerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [CascadingFilterComponent],
})
export class CascadingFilterModule {}
