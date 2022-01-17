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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) {}

  ngOnInit() {
    this.vcr.createEmbeddedView(this.templateRef);
    this.hasView = true;
  }
}
