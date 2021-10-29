import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { EnvService } from '../services/env/env.service';

@Directive({
  selector: '[appToggleStaking]'
})
export class ToggleStakingDirective implements OnInit {

  private hasView = false;

  constructor(private templateRef: TemplateRef<any>,
              private vcr: ViewContainerRef,
              private envService: EnvService) {
  }

  ngOnInit() {
    const featureEnabled = this.envService.staking;

    if (featureEnabled && !this.hasView) {
      this.vcr.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!featureEnabled && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }
}
