import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

enum ROUTE_MAPPING {
  TSO = "tso",
  BRP = "tso",
  DSO = "tso",
  OEM = "tso",
  Installer = "installer",
  "Asset-owner" = "owner",
  "Governing-body" = "governing",
}

@Component({
  selector: 'app-dashboard',
  template: ''
})
export class DashboardComponent implements OnInit {
  
  constructor(private authService: AuthService, private router: Router) { 
    this.router.navigate(['/dashboard/' + ROUTE_MAPPING[this.authService.currentUser().organizationType]]).then(()=>{
      console.log(this.authService.currentUser().organizationType);
    });
  }

  ngOnInit() {
      
      
  }

}
