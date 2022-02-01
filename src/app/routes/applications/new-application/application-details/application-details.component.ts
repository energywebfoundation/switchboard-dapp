import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IAppDefinition } from '@energyweb/iam-contracts';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationDetailsComponent {
  @Input() namespace: string;
  @Input() data: IAppDefinition;

  @Output() imageLoaded = new EventEmitter<boolean>();

  imageEventHandler(value: boolean): void {
    this.imageLoaded.emit(value);
  }

  get others() {
    return JSON.stringify(this.data?.others);
  }
}
