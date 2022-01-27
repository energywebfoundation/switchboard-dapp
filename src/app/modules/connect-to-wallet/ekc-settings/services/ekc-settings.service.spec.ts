import { TestBed } from '@angular/core/testing';

import { EkcSettingsService } from './ekc-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy } from '@tests';
import { EnvService } from '../../../../shared/services/env/env.service';
import { of } from 'rxjs';

const mockLocalStorage = () => {
  let store = {};
  const mockLocalStorage = {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };

  spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
  spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
  spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
  spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
};

describe('EkcSettingsService', () => {
  let service: EkcSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: EnvService, useValue: { ekcUrl: 'https://url.com' } },
      ],
    });
    mockLocalStorage();
    service = TestBed.inject(EkcSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call edit and set value to localstorage', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of('https://test.com'),
    });
    service.edit();
    expect(service.url).toEqual('https://test.com');
  });

  it('should return default url when returning value is falsy', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of('') });
    service.edit();
    expect(service.url).toEqual('https://url.com');
  });
});
