import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBlockPaste]',
})
export class PreventPasteDirective {
  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }
}
