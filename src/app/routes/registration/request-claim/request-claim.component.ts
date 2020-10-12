import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-request-claim',
  templateUrl: './request-claim.component.html',
  styleUrls: ['./request-claim.component.scss']
})
export class RequestClaimComponent implements OnInit {

  public enrolmentForm: FormGroup;
  public fieldList: {type: string, label: string, validation: string}[];
  
  constructor(private fb: FormBuilder) { 
    // Get data here
    this.fieldList = [{
      type: 'text',
      label: 'Name',
      validation: ''
    },{
      type: 'number',
      label: 'Age',
      validation: ''
    },{
      type: 'date',
      label: 'Birthdate',
      validation: ''
    },{
      type: 'boolean',
      label: 'Married',
      validation: ''
    },{
      type: 'text',
      label: 'Address',
      validation: ''
    },{
      type: 'number',
      label: 'Number of Children',
      validation: ''
    },{
      type: 'date',
      label: 'Registration Date',
      validation: ''
    },{
      type: 'boolean',
      label: 'Spicy Lover',
      validation: ''
    }];

    let controls = [];
    for (let { type, label, validation} of this.fieldList) {
      let control = new FormControl();
      switch (type) {
        case 'text':
          break;
        case 'number':
          break;
        case 'date':
          break;
        case 'boolean':
          break;
      }

      // add validations

      // add control to array
      controls.push(control);
    }

    this.enrolmentForm = fb.group({
      fields: fb.array(controls)
    });

    console.log(this.enrolmentForm);
  }

  ngOnInit() {
    
  }

}
