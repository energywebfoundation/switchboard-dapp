import { Directive, Inject, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FEAT_TOGGLE_TOKEN } from './feature-toggle.token';
import { FeatureToggle } from './feature-toggle.interface';

@Directive({
  selector: '[appIsFeatureEnabled]'
})
export class FeatureToggleDirective implements OnInit {

  private hasView = false;

  constructor(private templateRef: TemplateRef<any>,
              private vcr: ViewContainerRef,
              @Inject(FEAT_TOGGLE_TOKEN) private featureToggle: FeatureToggle) {
  }

  ngOnInit() {
    const featureEnabled = this.featureToggle.featureVisible;

    if (featureEnabled && !this.hasView) {
      this.vcr.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!featureEnabled && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }

}
