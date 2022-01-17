import { TestBed } from '@angular/core/testing';

import { IamListenerService } from './iam-listener.service';
import { SignerFacadeService } from '../signer-facade/signer-facade.service';

describe('IamListenerService', () => {
  let service: IamListenerService;
  const signerFacadeSpy = jasmine.createSpyObj(SignerFacadeService, ['on']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SignerFacadeService, useValue: signerFacadeSpy }],
    });
    service = TestBed.inject(IamListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call 3 events', () => {
    service.setListeners(() => {
      return;
    });
    expect(signerFacadeSpy.on).toHaveBeenCalledTimes(3);
  });
});
