import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DidListComponent } from './did-list.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getElement } from '@tests';

describe('DidListComponent', () => {
  let component: DidListComponent;
  let fixture: ComponentFixture<DidListComponent>;
  let hostDebug: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DidListComponent],
      imports: [MatButtonModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DidListComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('clicking delete button should emit remove event', () => {
    component.list = ['did', 'did1'];
    const eventSpy = spyOn(component.remove, 'emit');
    fixture.detectChanges();

    const deleteBtn = getElement(hostDebug)('delete-did-0')?.nativeElement;
    deleteBtn.click();
    fixture.detectChanges();

    expect(eventSpy).toHaveBeenCalledWith('did');
  });
});
