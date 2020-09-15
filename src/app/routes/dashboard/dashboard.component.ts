import { Component, OnInit } from '@angular/core';
import { IamService } from 'src/app/shared/services/iam.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public accountAddress = "";

  constructor(private iamService: IamService, private route: Router) { }

  ngOnInit() {
    console.log('accountAddress', this.iamService.user);
    this.accountAddress = this.iamService.user['accountAddress'];
  }

  goToEnrolment() {
    this.route.navigate(['enrolment']);
  }

}
