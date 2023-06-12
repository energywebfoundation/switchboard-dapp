import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldsComponent } from './fields.component';
import { DebugElement } from '@angular/core';
import { getElement } from '@tests';

describe('FieldsComponent', () => {
  let component: FieldsComponent;
  let fixture: ComponentFixture<FieldsComponent>;
  let hostDebug: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FieldsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should check if title is displayed', () => {
    component.title = 'Example title';
    component.fieldsList = [{ key: 'key', value: 'value' }];
    fixture.detectChanges();
    const { title } = getSelectors(hostDebug);

    expect(title.innerText).toContain(component.title);
  });

  it('should check if key and value are displayed', () => {
    component.fieldsList = [{ key: 'key', value: 'value' }];
    fixture.detectChanges();

    const { firstKey, firstValue } = getSelectors(hostDebug);

    expect(firstKey.innerText).toContain(component.fieldsList[0].key);
    expect(firstValue.innerText).toContain(component.fieldsList[0].value);
  });
  it('should emit to copy if value is valid', () => {
    component.fieldsList = [
      { key: 'ASIC Models', value: '[{"model":"model","numUnits":2}]' },
    ];
    component.showMergeButton = true;
    fixture.detectChanges();
    const dispatchSpy = spyOn(component.fieldToCopy, 'emit');
    const { firstValueMergeBtn } = getSelectors(hostDebug);
    firstValueMergeBtn.click();
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith({
      key: 'ASIC Models',
      value: '[{"model":"model","numUnits":2}]',
    });
  });
  it('should not show copy button if value is null', () => {
    component.fieldsList = [{ key: 'key', value: null }];
    component.showMergeButton = true;
    fixture.detectChanges();

    const { firstValueMergeBtn } = getSelectors(hostDebug);
    expect(firstValueMergeBtn).toBeUndefined();
  });
  it('should not show copy button if value is "null"', () => {
    component.fieldsList = [{ key: 'key', value: 'null' }];
    component.showMergeButton = true;
    fixture.detectChanges();

    const { firstValueMergeBtn } = getSelectors(hostDebug);
    expect(firstValueMergeBtn).toBeUndefined();
  });
  it('should not show copy button if it is not issuer requestor view', () => {
    component.fieldsList = [
      { key: 'ASIC Models', value: '[{"model":"model","numUnits":2}]' },
    ];
    component.showMergeButton = false;
    fixture.detectChanges();
    const { firstValueMergeBtn } = getSelectors(hostDebug);
    expect(firstValueMergeBtn).toBeUndefined();
  });
});
const getSelectors = (hostDebug) => {
  return {
    title: getElement(hostDebug)('field-list-title')?.nativeElement,
    firstKey: getElement(hostDebug)('field-list-key-0')?.nativeElement,
    firstValue: getElement(hostDebug)('field-list-value-0')?.nativeElement,
    firstValueMergeBtn: getElement(hostDebug)('field-list-merge-btn-0')
      ?.nativeElement,
  };
};
