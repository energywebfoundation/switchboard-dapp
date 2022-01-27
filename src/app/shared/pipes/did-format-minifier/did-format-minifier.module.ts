import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DidFormatMinifierPipe } from './did-format-minifier.pipe';

@NgModule({
  declarations: [DidFormatMinifierPipe],
  imports: [CommonModule],
  exports: [DidFormatMinifierPipe],
})
export class DidFormatMinifierModule {}
