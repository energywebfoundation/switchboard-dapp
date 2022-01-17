import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SettingsSelectors } from '@state';

@Injectable({
  providedIn: 'root',
})
export class ExperimentalGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean> {
    return this.store.select(SettingsSelectors.isExperimentalEnabled);
  }
}
