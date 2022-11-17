import { ShowRawDataDirective } from './show-raw-data.directive';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'test-raw-data',
  template: ` <div appShowRawData></div>`,
})
class TestRawDataComponent {}

describe('ShowRawDataDirective', () => {
  let component: TestRawDataComponent;
  let fixture: ComponentFixture<TestRawDataComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestRawDataComponent, ShowRawDataDirective],
      providers: [{ provide: MatDialog, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRawDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
