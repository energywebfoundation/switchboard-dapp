import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviewComponent } from './preview.component';
import { MatDialog } from '@angular/material/dialog';
import { EnrolmentListType } from '../../../models/enrolment-list-type.enum';
import { getElement } from '@tests';
import { IssuerRequestsComponent } from '../../../../view-requests/issuer-requests/issuer-requests.component';
import { ViewRequestsComponent } from '../../../../view-requests/view-requests.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;
  let matDialogSpy;
  beforeEach(waitForAsync(() => {
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      declarations: [PreviewComponent],
      providers: [{ provide: MatDialog, useValue: matDialogSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    matDialogSpy.open.and.returnValue({ afterClosed: () => of(true) });
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should open IssuerRequests dialog', () => {
    component.enrolmentType = EnrolmentListType.ISSUER;
    fixture.detectChanges();

    const { previewBtn } = getSelectors(fixture.debugElement);

    previewBtn.click();

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      IssuerRequestsComponent,
      jasmine.objectContaining({})
    );
  });

  it('should open ViewRequests dialog when type is applicant', () => {
    component.enrolmentType = EnrolmentListType.APPLICANT;
    fixture.detectChanges();

    const { previewBtn } = getSelectors(fixture.debugElement);

    previewBtn.click();

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ViewRequestsComponent,
      jasmine.objectContaining({})
    );
  });

  it('should open ViewRequests dialog when type is asset', () => {
    component.enrolmentType = EnrolmentListType.ASSET;
    fixture.detectChanges();

    const { previewBtn } = getSelectors(fixture.debugElement);

    previewBtn.click();

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ViewRequestsComponent,
      jasmine.objectContaining({})
    );
  });
});

const getSelectors = (hostDebug) => ({
  previewBtn: getElement(hostDebug)('preview')?.nativeElement,
});
