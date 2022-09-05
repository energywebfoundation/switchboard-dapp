import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmartSearchOptionComponent } from './smart-search-option.component';

describe('SmartSearchOptionComponent', () => {
  let component: SmartSearchOptionComponent;
  let fixture: ComponentFixture<SmartSearchOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SmartSearchOptionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartSearchOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false for isDefinitionDefined', () => {
    component.definition = {} as any;
    expect(component.isDefinitionDefined).toBeFalse();
  });

  it('should return true when definition contains appName', () => {
    component.definition = { appName: 'Something' } as any;
    expect(component.isDefinitionDefined).toBeTrue();
  });

  it('should return true when definition contains orgName', () => {
    component.definition = { orgName: 'Something' } as any;
    expect(component.isDefinitionDefined).toBeTrue();
  });
});
