import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifiablePresentationComponent } from './verifiable-presentation/verifiable-presentation.component';
import { RouterModule } from '@angular/router';
import { VpHeaderComponent } from './vp-header/vp-header.component';

@NgModule({
  declarations: [VerifiablePresentationComponent, VpHeaderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: VerifiablePresentationComponent },
    ]),
  ],
})
export class VerifiablePresentationModule {}
