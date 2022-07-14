import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Timestamp } from '../../../../../shared/pipes/time-duration/timestamp';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-validity-period',
  templateUrl: './validity-period.component.html',
  styleUrls: ['./validity-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidityPeriodComponent {
  @Input() set validityPeriod(value: number) {
    this.form.setValue({
      ...new Timestamp().determineFromSeconds(value),
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
    this.next.emit(new Timestamp().parseToSeconds(this.form.value));
  }
}
