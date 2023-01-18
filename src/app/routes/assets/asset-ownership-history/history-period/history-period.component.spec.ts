import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPeriodComponent, Period } from './history-period.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AssetHistoryEventType } from 'iam-client-lib';

describe('HistoryPeriodComponent', () => {
  let component: HistoryPeriodComponent;
  let fixture: ComponentFixture<HistoryPeriodComponent>;
  let historyElement: HTMLElement[];
  let verticalLine: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoryPeriodComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPeriodComponent);
    component = fixture.componentInstance;
    historyElement = fixture.nativeElement.querySelectorAll(
      'app-history-element'
    );
    verticalLine = fixture.nativeElement.querySelector('.border-vertical');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not return values when period is empty', () => {
    component.period = null;
    expect(component.getTopPart()).toBeUndefined();
    expect(component.getBottomPart()).toBeUndefined();
  });

  it('should compare history part when period have event Asset_transferred', () => {
    component.period = {
      type: 'ASSET_TRANSFERRED',
      relatedTo: 'relatedTo',
      emittedBy: 'emittedBy',
    } as Period;
    expect(component.getTopPart()).toEqual(
      jasmine.objectContaining({ header: 'Offered from', did: 'relatedTo' })
    );
    expect(component.getBottomPart()).toEqual(
      jasmine.objectContaining({ header: 'Owner', did: 'emittedBy' })
    );
  });

  it('should compare history part when perdiod event is not equal to Asset_transferred', () => {
    component.period = {
      type: AssetHistoryEventType.ASSET_OFFER_CANCELED,
      relatedTo: 'relatedTo',
      emittedBy: 'emittedBy',
    } as Period;
    expect(component.getTopPart()).toEqual(
      jasmine.objectContaining({ header: 'Owner', did: 'emittedBy' })
    );
    expect(component.getBottomPart()).toEqual(
      jasmine.objectContaining({ header: 'Offered to', did: 'relatedTo' })
    );
  });

  it('should not render line and second app-history-element when relatedTo is not defined', () => {
    fixture.detectChanges();
    expect(historyElement.length).toBe(1);
    expect(verticalLine).toBeNull();
  });
});
