import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatCardModule, MatFormFieldModule, MatButtonModule, MatDividerModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestClaimComponent } from './request-claim.component';

const routes: Routes = [
  { path: '', component: RequestClaimComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    NgxSpinnerModule
  ]
})
export class RequestClaimModule { }
