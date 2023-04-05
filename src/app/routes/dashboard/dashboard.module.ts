import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { UserInfoComponent } from './user-info/user-info.component';
import { CardComponent } from './card/card.component';
import { JsonEditorModule } from '@modules';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatStepperModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    WidgetsModule,
    NgxSpinnerModule,
    JsonEditorModule,
  ],
  declarations: [DashboardComponent, UserInfoComponent, CardComponent],
})
export class DashboardModule {}
