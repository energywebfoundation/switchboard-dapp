import { TestBed } from '@angular/core/testing';

import { SmartSearchService } from './smart-search.service';
import { DomainsFacadeService } from '../../../services/domains-facade/domains-facade.service';
import { of } from 'rxjs';

describe('SmartSearchService', () => {
  let service: SmartSearchService;
  const domainsFacadeSpy = jasmine.createSpyObj(DomainsFacadeService, [
    'getENSTypesBySearchPhrase',
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DomainsFacadeService, useValue: domainsFacadeSpy },
      ],
    });
    service = TestBed.inject(SmartSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty list when search word length is smaller than 3', (done) => {
    service.searchBy('aa').subscribe((v) => {
      expect(v.length).toEqual(0);
      done();
    });
  });

  it('should return empty list when search word contains only whitespaces', (done) => {
    service.searchBy('    ').subscribe((v) => {
      expect(v.length).toEqual(0);
      done();
    });
  });

  it('should return not empty list when search word contains more than 2 characters', (done) => {
    domainsFacadeSpy.getENSTypesBySearchPhrase.and.returnValue(
      of([{ namespace: 'a' }, { namespace: 'b' }])
    );
    service.searchBy('abc').subscribe((v) => {
      expect(v.length).toEqual(2);
      done();
    });
  });
});
