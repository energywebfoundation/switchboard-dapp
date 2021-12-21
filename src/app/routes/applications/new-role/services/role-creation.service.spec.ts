import { TestBed } from '@angular/core/testing';

import { RoleCreationService } from './role-creation.service';
import { DomainsFacadeService } from '../../../../shared/services/domains-facade/domains-facade.service';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { loadingServiceSpy, toastrSpy } from '@tests';
import { LoadingService } from '../../../../shared/services/loading.service';

describe('RoleCreationService', () => {
  let service: RoleCreationService;
  const domainsFacadeServiceSpy = jasmine.createSpyObj(DomainsFacadeService, ['isOwner', 'checkExistenceOfDomain']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: DomainsFacadeService, useValue: domainsFacadeServiceSpy},
        {provide: SwitchboardToastrService, useValue: toastrSpy},
        {provide: LoadingService, useValue: loadingServiceSpy}
      ]
    });
    service = TestBed.inject(RoleCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkIfUserCanUseDomain method', () => {
    it('should return true, when domain do not exist', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(Promise.resolve(false));
      const result = await service.checkIfUserCanUseDomain('domain');

      expect(result).toBeTrue();
    });

    it('should return true, when domain exist and user is the owner', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(Promise.resolve(true));
      domainsFacadeServiceSpy.isOwner.and.returnValue(Promise.resolve(true));
      const result = await service.checkIfUserCanUseDomain('domain');

      expect(result).toBeTrue();
    });

    it('should return false, when domain exist and user is not the owner', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(Promise.resolve(true));
      domainsFacadeServiceSpy.isOwner.and.returnValue(Promise.resolve(false));
      const result = await service.checkIfUserCanUseDomain('domain');

      expect(result).toBeFalse();
    });

    it('should catch error when is thrown by checkExistenceOfDomain', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(Promise.reject('reason'));
      domainsFacadeServiceSpy.isOwner.and.returnValue(Promise.resolve(false));
      const result = await service.checkIfUserCanUseDomain('domain');

      expect(result).toBeFalse();
      expect(toastrSpy.error).toHaveBeenCalled();
    });

    it('should catch error when is thrown by isOwner', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(Promise.resolve(true));
      domainsFacadeServiceSpy.isOwner.and.returnValue(Promise.reject('reason'));
      const result = await service.checkIfUserCanUseDomain('domain');

      expect(result).toBeFalse();
      expect(toastrSpy.error).toHaveBeenCalled();
    });
  });
});
