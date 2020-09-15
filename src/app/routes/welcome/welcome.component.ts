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

  async ngOnInit() {
    // Immediately navigate to dashboard if user is currently logged-in to walletconnect
    if (this.iamService.isLoggedIn()) {
      await this.iamService.login();
      this.route.navigate(['dashboard']);
    }
  }

  async connectToWallet() {
    if (await this.iamService.login()) {
      this.route.navigate(['dashboard']);
    }
  }
}
