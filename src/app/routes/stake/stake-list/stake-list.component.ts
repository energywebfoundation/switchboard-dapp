import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stake-list',
  templateUrl: './stake-list.component.html',
  styleUrls: ['./stake-list.component.scss']
})
export class StakeListComponent implements OnInit {

  mockData = [
    {
      organization:"Energy Web Foundation",
      organizationImage:"ew-flex-single-logo.png",
      providerDate:"April, 2017",
      stakeAmount:"2222.2222",
      stakeRating:"97",
      activeServices:"1",
      numberOfNodes:"1",
      isAcceptingPatrons:true
    },
    {
      organization:"Startup Co",
      organizationImage:"startup-co-single.svg",
      providerDate:"Sept, 2020",
      stakeAmount:"23.444",
      stakeRating:"50",
      activeServices:"1",
      numberOfNodes:"1",
      isAcceptingPatrons:true
    },
    {
      organization:"Startup Co",
      organizationImage:"startup-co-single2.svg",
      providerDate:"Sept, 2020",
      stakeAmount:"32.434",
      stakeRating:"75",
      activeServices:"0",
      numberOfNodes:"2",
      isAcceptingPatrons:true
    }
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToDetails() {
    this.router.navigate(['stake', 1]);
  }
}
