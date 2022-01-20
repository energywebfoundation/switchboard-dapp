import { MinifiedDidViewerDirective } from './minified-did-viewer.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

@Component({
  template:
    '<p [appMinifiedDidViewer]="appMinifiedDidViewer">Testing Directives is awesome!</p>',
})
class TestComponent {
  @Input() appMinifiedDidViewer = false;
}

xdescribe('MinifiedDidViewerDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, MinifiedDidViewerDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });
});
