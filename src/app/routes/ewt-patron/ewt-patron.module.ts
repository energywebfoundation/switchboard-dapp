import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EwtPatronComponent } from './ewt-patron/ewt-patron.component';
import { RoutesModule } from '../routes.module';
import { RouterModule } from '@angular/router';
import { AssetsComponent } from '../assets/assets.component';


@NgModule({
  declarations: [EwtPatronComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: EwtPatronComponent}])

  ]
})
export class EwtPatronModule {
}
