import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {

  }

  goToCreateNewIdentity() {
    console.log("i am called")
    this.route.navigate(['identity/create-new']);
  }
}
