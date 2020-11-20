import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultComponent } from './search-result.component';
import { Routes, RouterModule } from '@angular/router';
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule, MatSelectModule, MatTooltipModule, MatIconModule, MatInputModule, MatTableModule, MatDialogModule, MatFormFieldModule, MatAutocompleteModule, MatSidenavModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  { path: '', component: SearchResultComponent }
];

@NgModule({
  declarations: [SearchResultComponent],
  imports: [
    CommonModule,
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
  ]
})
export class SearchResultModule { }
