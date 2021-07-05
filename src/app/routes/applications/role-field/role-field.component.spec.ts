import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { RoleFieldComponent } from './role-field.component';

fdescribe('RoleFieldComponent', () => {
  let component: RoleFieldComponent;
  let fixture: ComponentFixture<RoleFieldComponent>;
  let hostDebug: DebugElement;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFieldComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    host = hostDebug.nativeElement;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add field button', () => {
    const { showField, addField } = setup(hostDebug);
    showField.nativeElement.click();
    fixture.detectChanges();

    it('should open form to add field', () => {
      expect(component.showAddFieldForm).toBeTruthy();
    });

    it('add button should be disabled', () => {
      expect(addField.nativeElement.disabled).toBeTruthy();
    });
  })

  const setup = (hostDebug: DebugElement) => {
    return {
      showField: hostDebug.query(By.css('[data-qa-id=show-field]')),
      addField: hostDebug.query(By.css('[data-qa-id=add-field]')),
    };
  };
});

