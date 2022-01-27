import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyToClipboardDirective } from './copy-to-clipboard.directive';

@NgModule({
  declarations: [CopyToClipboardDirective],
  imports: [CommonModule],
  exports: [CopyToClipboardDirective],
})
export class CopyToClipboardModule {}
