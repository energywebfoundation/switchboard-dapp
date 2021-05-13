import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { Router, RouterOutlet } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs/typings/tab-group';
import { tabAnimation } from './tabs-animation';

const urlMap = new Map<number, string>().set(0, 'owned').set(1, 'offered').set(2, 'previously');

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
  animations: [
    tabAnimation
  ]
})
export class AssetsComponent implements OnInit {
  @ViewChild('assetsTabGroup', { static: false }) assetsTabGroup: MatTabGroup;
  selectedIndex;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.mapUrlToSelectedTab(this.router.url);
  }

  tabClickHandler(i: MatTabChangeEvent) {
    this.router.navigate(['assets', urlMap.get(i.index)]);
  }

  setSelectedTab(i: number) {
    this.selectedIndex = i;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet.activatedRouteData === undefined ? -1 : outlet.activatedRouteData.animationId;
  }

  mapUrlToSelectedTab(url: string) {
    const urlCandidate: string[] = url.split('/').filter(fragment => fragment && fragment !== 'assets');
    if (urlCandidate.length === 0) {
      this.setSelectedTab(0);
      return;
    }

    this.setSelectedTab(0);
    this.selectedIndex = this.findSelectedTabId(urlCandidate[0]);
  }

  findSelectedTabId(url: string) {
    return Array.from(urlMap.values()).findIndex((value) => value === url);
  }
}
