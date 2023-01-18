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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';

import { SmartSearchComponent } from './components/smart-search/smart-search.component';
import { ReplaceUnderscorePipe } from './pipes/replace-underscore.pipe';
import { CopyToClipboardModule } from './directives/copy-to-clipboard/copy-to-clipboard.module';
import { DidFormatMinifierModule } from './pipes/did-format-minifier/did-format-minifier.module';
import { TableHeadingComponent } from './components/table-heading/table-heading.component';
import { NoRecordsComponent } from './components/no-records/no-records.component';
import { DomainTypePipe } from './pipes/domain-type/domain-type.pipe';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
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
  MatGridListModule,
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
  MatSidenavModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatSnackBarModule,
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
    BsDropdownModule,
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
    BsDropdownModule,
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
