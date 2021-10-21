import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { RoleFieldComponent } from './role-field.component';

describe('RoleFieldComponent', () => {
  let component: RoleFieldComponent;
  let fixture: ComponentFixture<RoleFieldComponent>;
  let hostDebug: DebugElement;
  let host: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RoleFieldComponent],
      imports: [
        MatButtonModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFieldComponent);

    component = fixture.componentInstance;
    component.fieldsList = [];
    hostDebug = fixture.debugElement;
    host = hostDebug.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be run updateDataSource', () => {
    const data = {value: 'testData'};
    spyOn(component.updateData, 'emit');

    component.updateDataSource(data);

    expect(component.updateData.emit).toHaveBeenCalledWith(data as any);
  });

  it('should be run moveDown', () => {
    component.fieldsList = [1, 2, 3];
    spyOn(component, 'updateDataSource');

    component.moveDown(1);

    expect(component.updateDataSource).toHaveBeenCalledWith([1, 3, 2]);
  });

  it('should be run moveUp', () => {
    component.fieldsList = [1, 2, 3];
    const i = 1;
    spyOn(component, 'updateDataSource');

    component.moveUp(i);

    expect(component.updateDataSource).toHaveBeenCalledWith([2, 1, 3]);
  });

  it('should be run deleteField', () => {
    component.fieldsList = [1, 2, 3];
    const i = 1;
    spyOn(component, 'updateDataSource');

    component.deleteField(i);

    expect(component.updateDataSource).toHaveBeenCalledWith([1, 3]);
  });

  it('should be run showAddFieldForm', () => {
    component.showFieldsForm = false;

    component.showAddFieldForm();

    expect(component.showFieldsForm).toBe(true);
  });
});

