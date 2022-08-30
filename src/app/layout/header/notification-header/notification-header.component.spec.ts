import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationHeaderComponent } from './notification-header.component';
import { DebugElement } from '@angular/core';
import { getElement } from '@tests';

describe('NotificationHeaderComponent', () => {
  let component: NotificationHeaderComponent;
  let fixture: ComponentFixture<NotificationHeaderComponent>;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationHeaderComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    component.title = 'example';
    fixture.detectChanges();
    const title = getElement(hostDebug)('notif-title');

    expect(title).toBeTruthy();
    expect(title.nativeElement.innerText).toContain(component.title);
  });

  it('should not show clear all button', () => {
    component.showClear = false;
    fixture.detectChanges();
    const title = getElement(hostDebug)('notif-clear');

    expect(title).toBeFalsy();
  });

  it('should emit event when clicking clear all', () => {
    const dispatchSpy = spyOn(component.clear, 'emit');
    fixture.detectChanges();

    const title = getElement(hostDebug)('notif-clear').nativeElement;

    title.click();

    expect(dispatchSpy).toHaveBeenCalled();
  });
});
