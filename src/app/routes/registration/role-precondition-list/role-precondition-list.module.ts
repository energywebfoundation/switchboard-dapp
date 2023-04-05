import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolePreconditionListComponent } from './role-precondition-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

@NgModule({
  declarations: [RolePreconditionListComponent],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [RolePreconditionListComponent],
})
export class RolePreconditionListModule {}
