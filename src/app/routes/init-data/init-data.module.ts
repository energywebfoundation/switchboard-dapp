import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { InitDataComponent } from './init-data.component';

const routes: Routes = [
  { path: '', component: InitDataComponent }
];

@NgModule({
  declarations: [InitDataComponent],
  imports: [
    SharedModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes),
    RouterModule,
  ]
})
export class InitDataModule { }
