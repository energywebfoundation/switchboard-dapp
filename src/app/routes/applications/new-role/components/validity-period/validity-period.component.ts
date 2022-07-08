import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-validity-period',
  templateUrl: './validity-period.component.html',
  styleUrls: ['./validity-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidityPeriodComponent {
  @Input() set validityPeriod(value: number) {
    this.form.patchValue(value);
  }
  @Output() next = new EventEmitter<number | undefined>();
  @Output() back = new EventEmitter();

  form = new FormControl(undefined, [
    Validators.min(0),
    Validators.max(Number.MAX_VALUE),
  ]);

  onNextHandler() {
    this.next.emit(+this.form.value);
  }
}
