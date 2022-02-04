import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RetryBtnDirective } from './retry-btn.directive';

@Component({
  template: '<p (appRetryBtn)="countRetry()">{{counter}}</p>',
})
class TestComponent {
  counter = 0;

  countRetry() {
    this.counter++;
  }
}

xdescribe('RetryBtnDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, RetryBtnDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });
});
