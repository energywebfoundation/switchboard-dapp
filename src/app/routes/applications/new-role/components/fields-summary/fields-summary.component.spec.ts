import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldsSummaryComponent } from './fields-summary.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

describe('FieldsSummaryComponent', () => {
  let component: FieldsSummaryComponent;
  let fixture: ComponentFixture<FieldsSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FieldsSummaryComponent],
      imports: [SharedModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should check if isText getter is true', () => {
    component.element = { fieldType: 'text' };
    fixture.detectChanges();

    expect(component.isText).toBeTrue();
  });

  it('should check if isNumber getter is true', () => {
    component.element = { fieldType: 'number' };
    fixture.detectChanges();

    expect(component.isNumber).toBeTrue();
  });

  it('should check if isDate getter is true', () => {
    component.element = { fieldType: 'date' };
    fixture.detectChanges();

    expect(component.isDate).toBeTruthy();
  });

  it('should check if isBoolean getter is true', () => {
    component.element = { fieldType: 'boolean' };
    fixture.detectChanges();

    expect(component.isBoolean).toBeTruthy();
  });

  it('should check if getters are false', () => {
    component.element = { fieldType: 'differentType' };
    fixture.detectChanges();

    expect(component.isText).toBeFalse();
    expect(component.isBoolean).toBeFalse();
    expect(component.isDate).toBeFalse();
    expect(component.isNumber).toBeFalse();
  });
});
