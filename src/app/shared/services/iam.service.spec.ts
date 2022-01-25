import { TestBed, waitForAsync } from '@angular/core/testing';

import { IamService } from './iam.service';
import { EnvService } from './env/env.service';
import { EkcSettingsService } from '../../modules/connect-to-wallet/ekc-settings/services/ekc-settings.service';

describe('IamService', () => {
  let service: IamService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          IamService,
          { provide: EnvService, useValue: {} },
          { provide: EkcSettingsService, useValue: {} },
        ],
      });

      service = TestBed.inject(IamService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
