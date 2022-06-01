import { Component, Input, OnInit, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-received-presentations',
  templateUrl: './received-presentations.component.html',
  styleUrls: ['./received-presentations.component.scss'],
})
export class ReceivedPresentationsComponent {
  @Input() tableData; 
  displayedColumns: string[] = ['descriptor', 'verification'];
  selectedCredentials$ = [];

  credentialSelected(data: any) {
   console.log(data, "THE SELECTED CREDENTIAL");
   this.selectedCredentials$.push(data)
  }

}



//http://localhost:4200/vp?_oob=eyJwcmVzZW50YXRpb25MaW5rIjp7InR5cGUiOiJzdHJpbmciLCJ1cmwiOiJzdHJpbmciLCJzc2lTZXNzaW9uIjoic3RyaW5nIn0sIm9jcGlUb2tlblVJRCI6IjVjODdhYzNlLTQwMGMtNDA2Yy05NjAwLTMyYzhmNzA1YmQyMiJ9
// eyJwcmVzZW50YXRpb25MaW5rIjp7InR5cGUiOiJzdHJpbmciLCJ1cmwiOiJzdHJpbmciLCJzc2lTZXNzaW9uIjoic3RyaW5nIn0sIm9jcGlUb2tlblVJRCI6IjVjODdhYzNlLTQwMGMtNDA2Yy05NjAwLTMyYzhmNzA1YmQyMiJ9