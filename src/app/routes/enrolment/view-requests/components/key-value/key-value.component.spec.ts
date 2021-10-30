import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KeyValueComponent } from './key-value.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatButtonModule } from '@angular/material/button';
import { getElement } from '@tests';
import { By } from '@angular/platform-browser';

describe('KeyValueComponent', () => {
  let component: KeyValueComponent;
  let fixture: ComponentFixture<KeyValueComponent>;
  let hostDebug: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KeyValueComponent],
      imports: [MatIconTestingModule, MatButtonModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display form and hide show btn when clicking on show form button', () => {
    let {showForm} = getSelectors(hostDebug);

    showForm.click();
    fixture.detectChanges();

    const form = hostDebug.query(By.css(`app-key-value-form`));
    showForm = getSelectors(hostDebug).showForm;

    expect(showForm).toBeFalsy();
    expect(form).toBeTruthy();
  });

  it('should add element to list and emit event', () => {
    const updatedListSpy = spyOn(component.updatedList, 'emit');
    const pair = {key: 'key', value: 'value'};

    component.addHandler(pair);

    expect(component.pairsList).toContain(pair);
    expect(updatedListSpy).toHaveBeenCalledWith([pair]);
  });

  it('should remove element from list and emit event', () => {
    const updatedListSpy = spyOn(component.updatedList, 'emit');
    const pair = {key: 'key', value: 'value'};

    component.pairsList = [pair];

    component.removeHandler(0);
    expect(updatedListSpy).toHaveBeenCalledWith([]);
  });
});

const getSelectors = (hostDebug) => ({
  showForm: getElement(hostDebug)('show-form')?.nativeElement
});
