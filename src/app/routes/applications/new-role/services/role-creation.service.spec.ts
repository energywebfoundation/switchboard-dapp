import { TestBed } from '@angular/core/testing';

import { RoleCreationService } from './role-creation.service';
import { DomainsFacadeService } from '../../../../shared/services/domains-facade/domains-facade.service';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { loadingServiceSpy } from '@tests';
import { LoadingService } from '../../../../shared/services/loading.service';
import { IssuerType } from '../models/issuer-type.enum';
import { DomainUtils } from '@utils';

describe('RoleCreationService', () => {
  let service: RoleCreationService;
  const domainsFacadeServiceSpy = jasmine.createSpyObj(DomainsFacadeService, [
    'isOwner',
    'checkExistenceOfDomain',
    'getDIDsByRole',
  ]);
  let toastrSpy;
  beforeEach(() => {
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    TestBed.configureTestingModule({
      providers: [
        { provide: DomainsFacadeService, useValue: domainsFacadeServiceSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });
    service = TestBed.inject(RoleCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('canUseDomain method', () => {
    const domain = DomainUtils.addRoleNameToNamespace(
      'rolename',
      'org.iam.ewc'
    );
    it('should return true, when domain do not exist and user is the owner', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(
        Promise.resolve(false)
      );
      domainsFacadeServiceSpy.isOwner.and.returnValue(Promise.resolve(true));
      const result = await service.canUseDomain(domain);

      expect(result).toBeTrue();
      expect(domainsFacadeServiceSpy.isOwner).toHaveBeenCalledWith(
        DomainUtils.getRoleNamespace(domain)
      );
    });

    it('should return false, when domain exist', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(
        Promise.resolve(true)
      );
      domainsFacadeServiceSpy.isOwner.and.returnValue(Promise.resolve(true));
      const result = await service.canUseDomain('domain');

      expect(result).toBeFalse();
    });

    it('should return false, when domain do not exist and user is not the owner', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(
        Promise.resolve(false)
      );
      domainsFacadeServiceSpy.isOwner.and.returnValue(Promise.resolve(false));
      const result = await service.canUseDomain('domain');

      expect(result).toBeFalse();
    });

    it('should catch error when is thrown by checkExistenceOfDomain', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(
        Promise.reject('reason')
      );
      domainsFacadeServiceSpy.isOwner.and.returnValue(Promise.resolve(false));
      const result = await service.canUseDomain('domain');

      expect(result).toBeFalse();
      expect(toastrSpy.error).toHaveBeenCalled();
    });

    it('should catch error when is thrown by isOwner', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(
        Promise.resolve(false)
      );
      domainsFacadeServiceSpy.isOwner.and.returnValue(Promise.reject('reason'));
      const result = await service.canUseDomain('domain');

      expect(result).toBeFalse();
      expect(toastrSpy.error).toHaveBeenCalled();
    });
  });

  describe('areIssuersValid method', () => {
    it('should return false and display a message when type is did and list is empty', async () => {
      const result = await service.isListOrRoleNameValid(
        IssuerType.DID,
        '',
        []
      );

      expect(result).toBeFalse();
      expect(toastrSpy.error).toHaveBeenCalled();
    });

    it('should return false and display a message when type is role and role name is empty', async () => {
      const result = await service.isListOrRoleNameValid(
        IssuerType.ROLE,
        '',
        []
      );

      expect(result).toBeFalse();
      expect(toastrSpy.error).toHaveBeenCalled();
    });

    it('should return true when type is did and list is not empty', async () => {
      const result = await service.isListOrRoleNameValid(IssuerType.DID, '', [
        'did',
      ]);

      expect(result).toBeTrue();
    });

    it('should return false when role name do not exist', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(
        Promise.resolve(false)
      );
      const result = await service.isListOrRoleNameValid(
        IssuerType.ROLE,
        'role',
        []
      );

      expect(result).toBeFalse();
      expect(toastrSpy.error).toHaveBeenCalled();
    });

    it('should return false when name exist but do not contain roles in namespace', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(
        Promise.resolve(true)
      );
      const result = await service.isListOrRoleNameValid(
        IssuerType.ROLE,
        'role',
        []
      );

      expect(result).toBeFalse();
      expect(toastrSpy.error).toHaveBeenCalled();
    });

    it('should return true when role exist', async () => {
      domainsFacadeServiceSpy.checkExistenceOfDomain.and.returnValue(
        Promise.resolve(true)
      );
      const result = await service.isListOrRoleNameValid(
        IssuerType.ROLE,
        'role.roles.asd.iam.ewc',
        []
      );

      expect(result).toBeTrue();
      expect(toastrSpy.error).not.toHaveBeenCalled();
    });
  });
});
