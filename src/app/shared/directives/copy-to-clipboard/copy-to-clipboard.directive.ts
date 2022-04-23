import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { SwitchboardToastrService } from '../../services/switchboard-toastr.service';
import { Clipboard } from '@angular/cdk/clipboard';
@Directive({
  selector: '[appCopyToClipboard]',
})
export class CopyToClipboardDirective {
  @Input() public copyClipboard: string;
  @Input() public message: string;

  @Output() public copied: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private toastr: SwitchboardToastrService,
    private clipboard: Clipboard
  ) {}

  @HostListener('click', ['$event'])
  public onClick(): void {
    if (!this.copyClipboard) {
      return;
    }

    if (this.clipboard.copy(this.copyClipboard)) {
      this.displaySuccessToastrMessage();
    } else {
      this.displayFailureToastrMessage();
    }
  }

  displaySuccessToastrMessage(): void {
    if (this.message) {
      this.toastr.success(`${this.message} successfully copied to clipboard.`);
    }
  }

  displayFailureToastrMessage(): void {
    this.toastr.error(`Copying to clipboard failed`);
  }
}
