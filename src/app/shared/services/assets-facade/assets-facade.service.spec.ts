import { TestBed } from '@angular/core/testing';

import { AssetsFacadeService } from './assets-facade.service';
import { IamService } from '../iam.service';
import { iamServiceSpy, loadingServiceSpy } from '@tests';
import { LoadingService } from '../loading.service';

describe('AssetsFacadeService', () => {
  let service: AssetsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: IamService, useValue: iamServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });
    service = TestBed.inject(AssetsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
