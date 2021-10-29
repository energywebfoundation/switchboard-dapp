import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { EnvService } from '../services/env/env.service';

@Directive({
  selector: '[appToggleApplication]'
})
export class ToggleApplicationDirective implements OnInit {

  private hasView = false;

  constructor(private templateRef: TemplateRef<any>,
              private vcr: ViewContainerRef,
              private envService: EnvService) {
  }

  ngOnInit() {
    const featureEnabled = this.envService.application;

    if (featureEnabled && !this.hasView) {
      this.vcr.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!featureEnabled && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }
}
