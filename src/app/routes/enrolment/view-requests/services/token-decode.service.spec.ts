import { TestBed } from '@angular/core/testing';

import { TokenDecodeService } from './token-decode.service';
import { IamService } from '../../../../shared/services/iam.service';

describe('TokenDecodeService', () => {
  let service: TokenDecodeService;
  let didRegistry;

  beforeEach(() => {
    didRegistry = jasmine.createSpyObj('didRegistry', ['decodeJWTToken']);
    TestBed.configureTestingModule({
      providers: [
        { provide: IamService, useValue: { didRegistry: didRegistry } },
      ],
    });
    service = TestBed.inject(TokenDecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should decode and return issuerFields from token', (done) => {
    didRegistry.decodeJWTToken.and.returnValue(
      Promise.resolve({
        claimData: {
          issuerFields: [{}],
        },
      })
    );
    service.getIssuerFields('token').subscribe((v) => {
      expect(v.length).toBe(1);
      done();
    });
  });

  it('should return nullable stream when token is nullable', (done) => {
    service.getIssuerFields(null).subscribe((v) => {
      expect(v).toEqual([]);
      done();
    });
  });

  it('should decode and return requestorFields from token', (done) => {
    didRegistry.decodeJWTToken.and.returnValue(
      Promise.resolve({
        claimData: {
          requestorFields: [{}],
        },
      })
    );
    service.getRequestorFields('token').subscribe((v) => {
      expect(v.length).toBe(1);
      done();
    });
  });

  it('should decode and return empty array when requestorFields are nullable', (done) => {
    didRegistry.decodeJWTToken.and.returnValue(Promise.resolve({}));
    service.getRequestorFields('token').subscribe((v) => {
      expect(v).toEqual([]);
      done();
    });
  });

  it('should decore and return fields as requestorFields from token', (done) => {
    didRegistry.decodeJWTToken.and.returnValue(
      Promise.resolve({
        claimData: {
          requestorFields: undefined,
          fields: [{}],
        },
      })
    );
    service.getRequestorFields('token').subscribe((v) => {
      expect(v.length).toBe(1);
      done();
    });
  });
});
