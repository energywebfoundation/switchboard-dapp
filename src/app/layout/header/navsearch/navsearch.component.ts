import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange, ElementRef } from '@angular/core';

@Component({
  selector: 'app-navsearch',
  templateUrl: './navsearch.component.html',
  styleUrls: ['./navsearch.component.scss']
})
export class NavsearchComponent implements OnInit, OnChanges {

  @Input() visible: boolean;
  @Output() onclose = new EventEmitter<boolean>();
  term: string;

  constructor(public elem: ElementRef) {
  }

  ngOnInit() {
    document.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.code === 'Escape') {// ESC
        this.closeNavSearch();
      }
    });
    document.addEventListener('click', event => {
      const contains = (this.elem.nativeElement !== event.target && this.elem.nativeElement.contains(event.target));
      if (!contains) {
        this.closeNavSearch();
      }
    });
  }

  closeNavSearch() {
    this.visible = false;
    this.onclose.emit();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // console.log(changes['visible'].currentValue)
    if (changes.visible.currentValue === true) {
      this.elem.nativeElement.querySelector('input').focus();
    }
  }

  handleForm() {
    // console.log('Form submit: ' + this.term);
  }
}
