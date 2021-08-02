import { OnInit, Directive, Input, ElementRef } from '@angular/core';

declare var $: any;

@Directive({
  selector: 'scrollable'
})
export class ScrollableDirective implements OnInit {

  @Input() height: number;
  defaultHeight = 250;

  constructor(public element: ElementRef) {
    // console.log("jjjjjj");
  }

  ngOnInit() {
    // console.log("jjjjj2j");
    $(this.element.nativeElement).slimScroll({
      height: (this.height || this.defaultHeight)
    });
  }

}
