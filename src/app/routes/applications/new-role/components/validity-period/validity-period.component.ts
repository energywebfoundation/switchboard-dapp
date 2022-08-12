import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Timestamp } from '../../../../../shared/pipes/time-duration/timestamp';

@Component({
  selector: 'app-validity-period',
  templateUrl: './validity-period.component.html',
  styleUrls: ['./validity-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidityPeriodComponent {
  @Input() set validityPeriod(value: number) {
    if (!value) {
      return;
    }
    this.form.setValue({
      ...new Timestamp().determineFromMiliseconds(value),
    });
  }
  @Output() next = new EventEmitter<number | undefined>();
  @Output() back = new EventEmitter();

  form = this.fb.group({
    years: [0, [Validators.min(0)]],
    days: [0, [Validators.min(0), Validators.max(364)]],
    hours: [0, [Validators.min(0), Validators.max(23)]],
    minutes: [0, [Validators.min(0), Validators.max(59)]],
    seconds: [0, [Validators.min(0), Validators.max(59)]],
  });

  constructor(private fb: FormBuilder) {}

  onNextHandler() {
    if (this.form.invalid) {
      return;
    }
    const theValue = new Timestamp().parseToMilliseconds(this.form.value);
    this.next.emit(theValue);
  }
}
