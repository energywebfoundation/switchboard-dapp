import { TestBed } from '@angular/core/testing';

import { IamService } from '../../../shared/services/iam.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AssetService } from './asset.service';

describe('AssetService', () => {
  let service: AssetService;
  const iamServiceSpy = jasmine.createSpyObj('IamService', [
    'registerAsset',
    'wrapWithLoadingService',
  ]);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'success']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: IamService, useValue: iamServiceSpy },
      ],
    });
    service = TestBed.inject(AssetService);
    iamServiceSpy.wrapWithLoadingService.and.callFake((source) => source);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register an asset', (done) => {
    iamServiceSpy.registerAsset.and.returnValue(of(''));

    service.register().subscribe(() => {
      expect(toastrSpy.success).toHaveBeenCalled();
      done();
    });
  });
});
