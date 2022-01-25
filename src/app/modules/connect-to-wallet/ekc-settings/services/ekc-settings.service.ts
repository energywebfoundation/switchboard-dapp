import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { truthy } from '@operators';
import { EkcSettingsComponent } from '../ekc-settings.component';
import { EnvService } from '../../../../shared/services/env/env.service';

const EKC_STORAGE_URL = 'EKC_URL';

@Injectable({
  providedIn: 'root',
})
export class EkcSettingsService {
  constructor(private dialog: MatDialog, private envService: EnvService) {}

  edit() {
    this.dialog
      .open(EkcSettingsComponent, {
        width: '600px',
        data: {
          url: this.url,
        },
      })
      .afterClosed()
      .pipe(truthy())
      .subscribe((url) => {
        this.saveToStorage = url;
      });
  }

  get url(): string {
    return localStorage.getItem(EKC_STORAGE_URL)
      ? localStorage.getItem(EKC_STORAGE_URL)
      : this.envService.ekcUrl;
  }

  private set saveToStorage(url: string) {
    localStorage.setItem(EKC_STORAGE_URL, url);
  }
}
