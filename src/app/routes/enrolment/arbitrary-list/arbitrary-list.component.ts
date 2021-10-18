import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-arbitrary-list',
  templateUrl: './arbitrary-list.component.html',
  styleUrls: ['./arbitrary-list.component.scss']
})
export class ArbitraryListComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[];

  constructor() {
  }

  ngOnInit(): void {
    this.displayedColumns = ['date', 'name', 'did', 'status'];
  }

  getList() {

  }

}
