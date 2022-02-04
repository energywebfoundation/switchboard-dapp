import { TestBed } from '@angular/core/testing';

import { ApplicationCreationService } from './application-creation.service';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { DomainsFacadeService } from '../../../../shared/services/domains-facade/domains-facade.service';

describe('ApplicationCreationService', () => {
  let service: ApplicationCreationService;
  let toastrSpy;
  let loadingServiceSpy;
  let domainsSpy;
  beforeEach(() => {
    toastrSpy = jasmine.createSpyObj('SwitchboardToastrService', [
      'success',
      'error',
    ]);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'show',
      'hide',
    ]);
    domainsSpy = jasmine.createSpyObj('DomainsFacadeService', [
      'checkExistenceOfDomain',
      'isOwner',
    ]);
    TestBed.configureTestingModule({
      providers: [
        { provide: SwitchboardToastrService, useValue: toastrSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: DomainsFacadeService, useValue: domainsSpy },
      ],
    });
    service = TestBed.inject(ApplicationCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when domain do not exist', async () => {
    domainsSpy.checkExistenceOfDomain.and.returnValue(Promise.resolve(false));

    expect(await service.isOrganizationNamespaceAvailable('test')).toBeFalse();
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Organization namespace does not exist.',
      undefined
    );
  });

  it('should return false when domain is undefined', async () => {
    expect(
      await service.isOrganizationNamespaceAvailable(undefined)
    ).toBeFalse();
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Organization Namespace is missing.',
      undefined
    );
  });

  it('should return false when sub domain is undefined', async () => {
    domainsSpy.checkExistenceOfDomain.and.returnValues(
      Promise.resolve(true),
      Promise.resolve(false)
    );

    expect(await service.isOrganizationNamespaceAvailable('test')).toBeFalse();
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Application subdomain in this organization does not exist.',
      undefined
    );
  });

  it('should return false when user is not owner of domain', async () => {
    domainsSpy.checkExistenceOfDomain.and.returnValues(
      Promise.resolve(true),
      Promise.resolve(true)
    );
    domainsSpy.isOwner.and.returnValue(Promise.resolve(false));

    expect(await service.isOrganizationNamespaceAvailable('test')).toBeFalse();
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'You are not authorized to create an application in this organization.',
      undefined
    );
  });

  it('should return true when user is owner of domain', async () => {
    domainsSpy.checkExistenceOfDomain.and.returnValues(
      Promise.resolve(true),
      Promise.resolve(true)
    );
    domainsSpy.isOwner.and.returnValue(Promise.resolve(true));

    expect(await service.isOrganizationNamespaceAvailable('test')).toBeTrue();
  });

  it('should return false when one endpoint will throw an error', async () => {
    domainsSpy.checkExistenceOfDomain.and.returnValues(
      Promise.reject({ message: 'reason' })
    );

    expect(await service.isOrganizationNamespaceAvailable('test')).toBeFalse();
    expect(toastrSpy.error).toHaveBeenCalledWith('reason', 'System Error');
  });
});
