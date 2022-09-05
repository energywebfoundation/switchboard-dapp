import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DidBookListComponent } from './did-book-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DidBookListComponent', () => {
  let component: DidBookListComponent;
  let fixture: ComponentFixture<DidBookListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DidBookListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DidBookListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should stick with default data when passing falsy value', () => {
    component.list = undefined;
    fixture.detectChanges();

    expect(component.list).toEqual([]);
  });

  it('should set data when passing an array', () => {
    component.list = [];
    fixture.detectChanges();

    expect(component.list).toEqual([]);
  });

  it('should emit delete event when calling remove method', () => {
    const deleteSpy = spyOn(component.delete, 'emit');
    component.remove('1');

    expect(deleteSpy).toHaveBeenCalledWith('1');
  });
});
