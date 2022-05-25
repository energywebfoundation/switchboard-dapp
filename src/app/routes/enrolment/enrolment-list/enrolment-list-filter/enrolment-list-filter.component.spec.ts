import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EnrolmentListFilterComponent, FilterStatus } from './enrolment-list-filter.component';
import { EnrolmentFilterListService } from '../services/enrolment-filter-list.service';
import { of } from 'rxjs';

describe('EnrolmentListFilterComponent', () => {
  let component: EnrolmentListFilterComponent;
  let fixture: ComponentFixture<EnrolmentListFilterComponent>;
  let enrolmentFilterListServiceSpy;

  beforeEach(waitForAsync( () => {
    enrolmentFilterListServiceSpy = jasmine.createSpyObj('EnrolmentFilterListService', ['setNamespace', 'setDid', 'setStatus', 'status$'])
    TestBed.configureTestingModule({
      declarations: [EnrolmentListFilterComponent],
      providers: [{provide: EnrolmentFilterListService, useValue: enrolmentFilterListServiceSpy}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentListFilterComponent);
    enrolmentFilterListServiceSpy.status$.and.returnValue(of(FilterStatus.All));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
