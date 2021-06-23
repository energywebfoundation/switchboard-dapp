import { FeatureToggleDirective } from './feature-toggle.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FEAT_TOGGLE_TOKEN } from './feature-toggle.token';

@Component({
  selector: 'app-test',
  template: `
      <div *appIsFeatureEnabled></div>`
})
class TestComponent {
}

describe('FeatureToggleDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  describe('feature visible set to true', () => {

    beforeEach(() => {
      fixture = TestBed.configureTestingModule({
        declarations: [TestComponent, FeatureToggleDirective],
        providers: [{provide: FEAT_TOGGLE_TOKEN, useValue: {featureVisible: true}}],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
        .createComponent(TestComponent);
      fixture.detectChanges();
    });

    it('should not hide div', () => {
      const div = fixture.debugElement.query(By.css('div'));
      expect(div).toBeTruthy();
    });
  });

  describe('feature visible set to false', () => {

    beforeEach(() => {
      fixture = TestBed.configureTestingModule({
        declarations: [TestComponent, FeatureToggleDirective],
        providers: [{provide: FEAT_TOGGLE_TOKEN, useValue: {featureVisible: false}}],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
        .createComponent(TestComponent);
      fixture.detectChanges();
    });

    it('should hide div', () => {
      const div = fixture.debugElement.query(By.css('div'));
      expect(div).toBeFalsy();
    });
  });

});
