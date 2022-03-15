import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private previousUrl = new BehaviorSubject<string>(null);
  private currentUrl = new BehaviorSubject<string>(null);

  get previous(): Observable<string> {
    return this.previousUrl.asObservable();
  }

  current() {
    return this.currentUrl.asObservable();
  }

  constructor(private router: Router, private location: Location) {}

  init() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => this.updateHistory(e));
  }

  goTo(url: string) {
    this.router.navigateByUrl(url);
  }

  back(): void {
    this.location.back();
  }

  private updateHistory(event: NavigationEnd): void {
    this.previousUrl.next(this.currentUrl.getValue());
    this.currentUrl.next(event.url);
  }
}
