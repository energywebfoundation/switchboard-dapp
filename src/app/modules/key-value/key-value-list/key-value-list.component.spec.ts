import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KeyValueListComponent } from './key-value-list.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { getElement } from '@tests';
import { MatButtonModule } from '@angular/material/button';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTableModule } from '@angular/material/table';

describe('KeyValueListComponent', () => {
  let component: KeyValueListComponent;
  let fixture: ComponentFixture<KeyValueListComponent>;
  let hostDebug: DebugElement;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [KeyValueListComponent],
        imports: [MatButtonModule, MatIconTestingModule, MatTableModule],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueListComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit event for removing element', () => {
    const spyDelete = spyOn(component.delete, 'emit');
    component.data = [{ key: 'key', value: 'value' }];
    fixture.detectChanges();

    const remove = getElement(hostDebug)('remove-0').nativeElement;
    remove.click();
    fixture.detectChanges();

    expect(spyDelete).toHaveBeenCalledWith(0);
  });
});
