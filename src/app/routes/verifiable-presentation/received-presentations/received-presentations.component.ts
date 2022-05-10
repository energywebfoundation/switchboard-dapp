import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-received-presentations',
  templateUrl: './received-presentations.component.html',
  styleUrls: ['./received-presentations.component.scss'],
})
export class ReceivedPresentationsComponent {
  displayedColumns: string[] = ['namespace', 'reason'];
  dataSource = new MatTableDataSource([
    { namespace: 'installer', reason: 'asdf dsa' },
    { namespace: 'installer2', reason: 'Some other reason' },
  ]);
}
