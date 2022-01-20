import {
  Directive,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[appIsFeatureEnabled]',
})
export class FeatureToggleMockDirective implements OnInit {
  private hasView = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) {}

  ngOnInit() {
    this.vcr.createEmbeddedView(this.templateRef);
    this.hasView = true;
  }
}
