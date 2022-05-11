import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-received-presentations',
  templateUrl: './received-presentations.component.html',
  styleUrls: ['./received-presentations.component.scss'],
})
export class ReceivedPresentationsComponent {
  displayedColumns: string[] = ['descriptor', 'verification'];
  dataSource = new MatTableDataSource([
    { descriptor: 'Charging Data Agreement', selfSign: true },
    { descriptor: 'Customer Role Credential', selfSign: false, credentials: ['Option 1', 'Option 2', 'Option 3'] },
  ]);
}

//http://localhost:4200/vp?_oob=eyJwcmVzZW50YXRpb25MaW5rIjp7InR5cGUiOiJzdHJpbmciLCJ1cmwiOiJzdHJpbmciLCJzc2lTZXNzaW9uIjoic3RyaW5nIn0sIm9jcGlUb2tlblVJRCI6IjVjODdhYzNlLTQwMGMtNDA2Yy05NjAwLTMyYzhmNzA1YmQyMiJ9
// eyJwcmVzZW50YXRpb25MaW5rIjp7InR5cGUiOiJzdHJpbmciLCJ1cmwiOiJzdHJpbmciLCJzc2lTZXNzaW9uIjoic3RyaW5nIn0sIm9jcGlUb2tlblVJRCI6IjVjODdhYzNlLTQwMGMtNDA2Yy05NjAwLTMyYzhmNzA1YmQyMiJ9