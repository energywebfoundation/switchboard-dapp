import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifiablePresentationComponent } from './verifiable-presentation/verifiable-presentation.component';
import { RouterModule } from '@angular/router';
import { VpHeaderComponent } from './vp-header/vp-header.component';
import { ReceivedPresentationsComponent } from './received-presentations/received-presentations.component';
import { SharedModule } from '../../shared/shared.module';
import { PresentationCredentialsComponent } from './presentation-credentials/presentation-credentials.component';
import { VpCardComponent } from './vp-card/vp-card.component';

@NgModule({
  declarations: [VerifiablePresentationComponent, VpHeaderComponent, ReceivedPresentationsComponent, PresentationCredentialsComponent, VpCardComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: VerifiablePresentationComponent },
    ]),
  ],
})
export class VerifiablePresentationModule {}
