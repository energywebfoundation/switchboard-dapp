import { NgModule } from '@angular/core';
import { SearchResultComponent } from './search-result.component';
import { Routes, RouterModule } from '@angular/router';
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule, MatSelectModule, MatTooltipModule, MatIconModule, MatInputModule, MatTableModule, MatDialogModule, MatFormFieldModule, MatAutocompleteModule, MatSidenavModule, MatButtonToggleModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { GovernanceDetailsModule } from '../applications/governance-view/governance-details/governance-details.module';
import { FlexLayoutModule } from "@angular/flex-layout";

const routes: Routes = [
  { path: '', component: SearchResultComponent }
];

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
    FlexLayoutModule,
    MatButtonToggleModule
  ]
})
export class SearchResultModule { }
