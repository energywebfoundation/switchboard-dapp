import { TestBed } from '@angular/core/testing';

import { VerificationService } from './verification.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { DidRegistryFacadeService } from '../../../shared/services/did-registry-facade/did-registry-facade.service';

describe('VerificationService', () => {
  let service: VerificationService;
  const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
    'show',
    'hide',
  ]);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);
  const didRegistryFacadeSpy = jasmine.createSpyObj(DidRegistryFacadeService, [
    'updateDocument',
    'getDidDocument',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DidRegistryFacadeService, useValue: didRegistryFacadeSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy },
      ],
    });
    service = TestBed.inject(VerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateDocumentAndReload', () => {
    it('should check returned value', (done) => {
      const publicKey = {
        controller: '0xAB6b0b9f9002B2a962D5Fe7a0F2A3402C4A8FaFC',
        id: 'did:ethr:0xAB6b0b9f9002B2a962D5Fe7a0F2A3402C4A8FaFC#key-owner',
        publicKeyHex:
          '0x0235c8f279e7c9d63e1f7ed4084ed8ceb7e1f8877b31507ab73019a5b90ca43ff1',
        type: 'Secp256k1veriKey',
      };
      didRegistryFacadeSpy.updateDocument.and.returnValue(Promise.resolve());
      didRegistryFacadeSpy.getDidDocument.and.returnValue(
        Promise.resolve({
          publicKey: [publicKey],
        })
      );
      service.updateDocumentAndReload('', '', 0).subscribe((publicKeys) => {
        expect(publicKeys.length).toBe(1);
        expect(publicKeys).toContain(jasmine.objectContaining(publicKey));
        done();
      });
      expect(loadingServiceSpy.show).toHaveBeenCalled();
    });

    it('should check while error occurs', () => {
      didRegistryFacadeSpy.updateDocument.and.returnValue(Promise.reject());

      service.updateDocumentAndReload('', '', 0).subscribe(
        () => {
          // pass
        },
        () => {
          expect(toastrSpy.error).toHaveBeenCalled();
        }
      );
      expect(loadingServiceSpy.show).toHaveBeenCalled();
    });
  });
});
