import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifiablePresentationComponent } from './verifiable-presentation/verifiable-presentation.component';
import { RouterModule } from '@angular/router';
import { VpHeaderComponent } from './vp-header/vp-header.component';
import { ReceivedPresentationsComponent } from './received-presentations/received-presentations.component';

@NgModule({
  declarations: [VerifiablePresentationComponent, VpHeaderComponent, ReceivedPresentationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: VerifiablePresentationComponent },
    ]),
  ],
})
export class VerifiablePresentationModule {}
