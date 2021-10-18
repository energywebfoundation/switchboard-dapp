import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ArbitraryActions, ArbitrarySelectors } from '@state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-arbitrary-list',
  templateUrl: './arbitrary-list.component.html',
  styleUrls: ['./arbitrary-list.component.scss']
})
export class ArbitraryListComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['date', 'name', 'did', 'status'];
  private subscription$ = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.getList();
    this.setListData();
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }

  getList() {
    this.store.dispatch(ArbitraryActions.getList());
  }

  private setListData() {
    this.store.select(ArbitrarySelectors.getList)
      .pipe(takeUntil(this.subscription$))
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

}
