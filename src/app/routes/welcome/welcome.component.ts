import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IamService } from 'src/app/shared/services/iam.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private route: Router, private iamService: IamService) { }

  ngOnInit() {
    if (this.iamService.iam.isLoggedIn()) {
      console.log("loggedin");
      this.route.navigate(['dashboard']);
    }
    console.log("not loggedin");
  }

  goToCreateNewIdentity() {
    console.log("i am called")
    this.route.navigate(['identity/create-new']);
  }

  async connectToWallet() {
    if (await this.iamService.login()) {
      this.route.navigate(['dashboard']);
    }
  }
}
