import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { RatingModule } from 'ngx-bootstrap/rating';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';

import { ColorsService } from './colors/colors.service';
import { ScrollableDirective } from './directives/scrollable/scrollable.directive';
import { PreventPasteDirective } from './directives/prevent-paste.directive';
import { RetryBtnDirective } from './directives/retry-btn/retry-btn.directive';
import { EnrolmentListComponent } from '../routes/enrolment/enrolment-list/enrolment-list.component';
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
import { RoleTypePipe } from './pipes/role-type/role-type.pipe';


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
    TranslateModule,
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    DatepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    TypeaheadModule.forRoot(),
    CopyToClipboardModule,
    DidFormatMinifierModule,
    MATERIAL_MODULES
  ],
  providers: [
    ColorsService
  ],
  declarations: [
    ScrollableDirective,
    PreventPasteDirective,
    RetryBtnDirective,
    EnrolmentListComponent,
    MinifiedDidViewerDirective,
    MinifiedDidViewerDialogComponent,
    SmartSearchComponent,
    ReplaceUnderscorePipe,
    TableHeadingComponent,
    NoRecordsComponent,
    RoleTypePipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    AccordionModule,
    AlertModule,
    ButtonsModule,
    CarouselModule,
    CollapseModule,
    DatepickerModule,
    BsDatepickerModule,
    BsDropdownModule,
    ModalModule,
    PaginationModule,
    ProgressbarModule,
    RatingModule,
    TabsModule,
    TimepickerModule,
    TooltipModule,
    PopoverModule,
    TypeaheadModule,
    ScrollableDirective,
    PreventPasteDirective,
    RetryBtnDirective,
    MinifiedDidViewerDirective,
    EnrolmentListComponent,
    MATERIAL_MODULES,
    SmartSearchComponent,
    ReplaceUnderscorePipe,
    CopyToClipboardModule,
    DidFormatMinifierModule,
    TableHeadingComponent,
    NoRecordsComponent,
    RoleTypePipe
  ],
  entryComponents: [MinifiedDidViewerDialogComponent]
})

// https://github.com/ocombe/ng2-translate/issues/209
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule
    };
  }
}
