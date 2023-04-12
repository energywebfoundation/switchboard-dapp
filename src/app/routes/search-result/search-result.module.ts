import { NgModule } from '@angular/core';
import { SearchResultComponent } from './search-result.component';
import { RouterModule, Routes } from '@angular/router';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../../shared/shared.module';
import { GovernanceDetailsModule } from '../applications/governance-view/governance-details/governance-details.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatSidenavModule } from '@angular/material/sidenav';

const routes: Routes = [{ path: '', component: SearchResultComponent }];

@NgModule({
  declarations: [SearchResultComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    RouterModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSidenavModule,
    NgxSpinnerModule,
    GovernanceDetailsModule,
    MatButtonToggleModule,
  ],
})
export class SearchResultModule {}
