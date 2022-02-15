import { NgModule } from '@angular/core';
import { DefaultValuePipe } from './default-value.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DefaultValuePipe],
  imports: [CommonModule],
  exports: [DefaultValuePipe],
})
export class DefaultValueModule {}
