import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-enrolment-pagination',
  templateUrl: './enrolment-pagination.component.html',
  styleUrls: ['./enrolment-pagination.component.scss'],
})
export class EnrolmentPaginationComponent {
  @Input() skip = 0;
  @Input() take = 0;
  @Input() hasNextPage = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() lastPage = new EventEmitter<void>();

  get hasPreviousPage(): boolean {
    return this.skip > 0;
  }

  get canPaginate(): boolean {
    return this.hasPreviousPage || this.hasNextPage;
  }

  get pageNumber(): number {
    return this.take ? this.skip / this.take + 1 : 1;
  }

  goToFirstPage(): void {
    if (this.hasPreviousPage) {
      this.pageChange.emit(0);
    }
  }

  goToPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageChange.emit(Math.max(this.skip - this.take, 0));
    }
  }

  goToNextPage(): void {
    if (this.hasNextPage) {
      this.pageChange.emit(this.skip + this.take);
    }
  }

  goToLastPage(): void {
    if (this.hasNextPage) {
      this.lastPage.emit();
    }
  }
}
