import { Component, Input, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {
  @Input() title: string;
  @Input() fieldsList: KeyValue<string, string | number>[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
