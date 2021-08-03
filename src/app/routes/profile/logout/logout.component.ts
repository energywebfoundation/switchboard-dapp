import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogOutComponent implements OnInit {


  constructor(private authenticationService: AuthService,
              private spinner: NgxSpinnerService,
              private router: Router) {
  }

  ngOnInit() {
    this.authenticationService.logout().then(() => {
      this.spinner.hide();
      this.router.navigate(['dashboard']).then(() => {
        // window.location.reload();
      });
    });
  }

}
