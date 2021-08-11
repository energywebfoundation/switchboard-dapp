import { Component, OnInit } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { LoginService } from '../shared/services/login/login.service';

const SWAL = require('sweetalert');

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private userIdle: UserIdleService, private loginService: LoginService) {
  }

  ngOnInit() {
    // Start watching for user inactivity
    this.userIdle.startWatching();
    this.userIdle.onTimerStart().subscribe();

    // Watch when time is up.
    this.userIdle.onTimeout().subscribe(async () => {
      await this._displayTimeout();
    });
  }

  private async _displayTimeout() {
    const config = {
      title: 'User Idle',
      text: 'You have been idle for a while. Logging-out...',
      icon: 'error',
      button: 'Proceed',
      closeOnClickOutside: false
    };

    const result = await SWAL(config);
    if (result) {
      this._logout();
    }
  }

  private _logout() {
    this.loginService.logoutAndRefresh(true);
  }
}
