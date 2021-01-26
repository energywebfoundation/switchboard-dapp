import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TemplatesComponent } from './templates.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [
  { path: '', component: TemplatesComponent }
];

@NgModule({
  declarations: [TemplatesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RouterModule,
    LayoutModule,
    SharedModule
  ]
})
export class TemplatesModule { }
