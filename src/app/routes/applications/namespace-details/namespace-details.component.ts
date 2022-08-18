import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IAppDefinition } from 'iam-client-lib';

@Component({
  selector: 'app-namespace-details',
  templateUrl: './namespace-details.component.html',
  styleUrls: ['./namespace-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NamespaceDetailsComponent {
  @Input() namespace: string;
  @Input() name: string;
  @Input() type: 'App' | 'Org';
  @Input() data: IAppDefinition;

  @Output() imageLoaded = new EventEmitter<boolean>();

  imageEventHandler(value: boolean): void {
    this.imageLoaded.emit(value);
  }
}
