import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppDomain, AppDomainDefinition } from '../models/app-domain';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss'],
})
export class ApplicationDetailsComponent {
  @Input() namespace: string;
  @Input() data: AppDomainDefinition

  @Output() imageLoaded = new EventEmitter<boolean>();

  imageEventHandler(value: boolean): void {
    this.imageLoaded.emit(value);
  }
}
