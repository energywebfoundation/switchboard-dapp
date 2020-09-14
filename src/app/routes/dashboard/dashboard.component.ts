import { Component, OnInit } from '@angular/core';
import { IamService } from 'src/app/shared/services/iam.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public accountAddress = "";

  constructor(private iamService: IamService) { }

  ngOnInit() {
    console.log('accountAddress', this.iamService.user);
    this.accountAddress = this.iamService.user['accountAddress'];
  }

}
