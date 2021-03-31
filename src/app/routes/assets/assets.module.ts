import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsComponent } from './assets.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatDividerModule, MatProgressSpinnerModule, MatDialogModule, MatInputModule, MatExpansionModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { GovernanceDetailsModule } from '../applications/governance-view/governance-details/governance-details.module';
import { NgMatSearchBarModule } from 'ng-mat-search-bar';
import { NewAssetTypeComponent } from './new-asset-type/new-asset-type.component';
import { NewPassiveAssetComponent } from './new-passive-asset/new-passive-asset.component';
import { AssetListComponent } from './asset-list/asset-list.component';

const routes: Routes = [
  { path: '', component: AssetsComponent }
];


@NgModule({
  declarations: [AssetsComponent, NewAssetTypeComponent, NewPassiveAssetComponent, AssetListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    RouterModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatDialogModule,
    MatInputModule,
    GovernanceDetailsModule,
    MatExpansionModule,
    NgMatSearchBarModule
  ],
  entryComponents: [NewAssetTypeComponent, NewPassiveAssetComponent]
})
export class AssetsModule { }
