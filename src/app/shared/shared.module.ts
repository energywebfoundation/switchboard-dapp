import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ColorsService } from './colors/colors.service';
import { PreventPasteDirective } from './directives/prevent-paste.directive';
import { RetryBtnDirective } from './directives/retry-btn/retry-btn.directive';
import { MinifiedDidViewerDirective } from './directives/minified-did-viewer/minified-did-viewer.directive';
import { MinifiedDidViewerDialogComponent } from './directives/minified-did-viewer/minified-did-viewer-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { SmartSearchComponent } from './components/smart-search/smart-search.component';
import { ReplaceUnderscorePipe } from './pipes/replace-underscore.pipe';
import { CopyToClipboardModule } from './directives/copy-to-clipboard/copy-to-clipboard.module';
import { DidFormatMinifierModule } from './pipes/did-format-minifier/did-format-minifier.module';
import { TableHeadingComponent } from './components/table-heading/table-heading.component';
import { NoRecordsComponent } from './components/no-records/no-records.component';
import { DomainTypePipe } from './pipes/domain-type/domain-type.pipe';
import { QrCodeScannerModule } from './components/qr-code-scanner/qr-code-scanner.module';
import { DomainImageComponent } from './components/domain-image/domain-image.component';
import { ReportProblemComponent } from './components/report-problem/report-problem.component';
import { SmartSearchOptionComponent } from './components/smart-search/component/smart-search-option/smart-search-option.component';
import { GenericTableComponent } from './components/table/generic-table/generic-table.component';
import { TimeDurationPipe } from './pipes/time-duration/time-duration.pipe';
import { CardInfoComponent } from './components/card-info/card-info.component';
import { TimeShiftPipe } from './pipes/time-shift/time-shift.pipe';
import { DefaultDatePipe } from './pipes/default-date/default-date.pipe';
import { ExpirationInfoComponent } from './expiration/info/expiration-info.component';
import { ExpirationDateComponent } from './expiration/date-picker/expiration-date.component';
import { ParseFieldValuePipe } from './pipes/parse-field-value/parse-field-value.pipe';

const MATERIAL_MODULES = [
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatTableModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatSortModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatNativeDateModule,
  MatStepperModule,
];

// https://angular.io/styleguide#!#04-10
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CopyToClipboardModule,
    DidFormatMinifierModule,
    MATERIAL_MODULES,
    QrCodeScannerModule,
  ],
  providers: [ColorsService, DatePipe],
  declarations: [
    PreventPasteDirective,
    RetryBtnDirective,
    MinifiedDidViewerDirective,
    MinifiedDidViewerDialogComponent,
    SmartSearchComponent,
    ReplaceUnderscorePipe,
    TableHeadingComponent,
    NoRecordsComponent,
    DomainTypePipe,
    DomainImageComponent,
    ReportProblemComponent,
    SmartSearchOptionComponent,
    GenericTableComponent,
    TimeDurationPipe,
    CardInfoComponent,
    TimeShiftPipe,
    DefaultDatePipe,
    ExpirationInfoComponent,
    ExpirationDateComponent,
    ParseFieldValuePipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PreventPasteDirective,
    RetryBtnDirective,
    MinifiedDidViewerDirective,
    MATERIAL_MODULES,
    SmartSearchComponent,
    ReplaceUnderscorePipe,
    CopyToClipboardModule,
    DidFormatMinifierModule,
    TableHeadingComponent,
    NoRecordsComponent,
    DomainTypePipe,
    QrCodeScannerModule,
    DomainImageComponent,
    ReportProblemComponent,
    GenericTableComponent,
    TimeDurationPipe,
    CardInfoComponent,
    TimeShiftPipe,
    DefaultDatePipe,
    ExpirationInfoComponent,
    ExpirationDateComponent,
    ParseFieldValuePipe,
  ],
})

// https://github.com/ocombe/ng2-translate/issues/209
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    };
  }
}
