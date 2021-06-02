import { TestBed } from '@angular/core/testing';

import { VerificationService } from './verification.service';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';

describe('VerificationService', () => {
  let service: VerificationService;
  const iamSpy = jasmine.createSpyObj('iam', ['updateDidDocument', 'getDidDocument']);
  const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: IamService, useValue: { iam: iamSpy } },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy }
      ]
    });
    service = TestBed.inject(VerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateDocumentAndReload', () => {
    it('should check returned value', () => {
      const publicKey = {
        controller: '0xAB6b0b9f9002B2a962D5Fe7a0F2A3402C4A8FaFC',
        id: 'did:ethr:0xAB6b0b9f9002B2a962D5Fe7a0F2A3402C4A8FaFC#key-owner',
        publicKeyHex: '0x0235c8f279e7c9d63e1f7ed4084ed8ceb7e1f8877b31507ab73019a5b90ca43ff1',
        type: 'Secp256k1veriKey'
      };
      iamSpy.updateDidDocument.and.returnValue(Promise.resolve());
      iamSpy.getDidDocument.and.returnValue(Promise.resolve({
        publicKey: [publicKey]
      }));
      service.updateDocumentAndReload('', '').subscribe((publicKeys) => {
        expect(publicKeys.length).toBe(1);
        expect(publicKeys).toContain(jasmine.objectContaining(publicKey));
      });
      expect(loadingServiceSpy.show).toHaveBeenCalled();
    });

    it('should check while error occurs', () => {
      iamSpy.updateDidDocument.and.returnValue(Promise.reject());

      service.updateDocumentAndReload('', '').subscribe(() => {
      }, () => {
        expect(toastrSpy.error).toHaveBeenCalled();
      });
      expect(loadingServiceSpy.show).toHaveBeenCalled();
    });

  });
});
