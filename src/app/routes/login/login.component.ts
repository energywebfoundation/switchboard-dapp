import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatListOption } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  ownedRoles: string[] = ['Consumer', 'Owner'];

  constructor() { }

  @ViewChild(MatSelectionList, {static: true})
  private selectionList: MatSelectionList;

  ngOnInit() {
    this.selectionList.selectedOptions = new SelectionModel<MatListOption>(false);
  }

}
