import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { SmartSearchComponent } from './smart-search.component';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getElement } from '@tests';
import { SmartSearchService } from '../../smart-search/services/smart-search.service';
import { of } from 'rxjs';

describe('SmartSearchComponent', () => {
  let component: SmartSearchComponent;
  let fixture: ComponentFixture<SmartSearchComponent>;
  const smartSearchServiceSpy = jasmine.createSpyObj(SmartSearchService, ['searchBy']);
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SmartSearchComponent],
      imports: [
        MatInputModule,
        ReactiveFormsModule,
        MatIconTestingModule,
        MatButtonModule,
        MatAutocompleteModule,
        NoopAnimationsModule
      ],
      providers: [{provide: SmartSearchService, useValue: smartSearchServiceSpy}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartSearchComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    component.searchText = new FormControl('');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update displayed value', fakeAsync(() => {
    smartSearchServiceSpy.searchBy.and.returnValue(of([]));
    const control = new FormControl('');
    component.searchText = control;

    fixture.detectChanges();
    tick(1200);

    control.patchValue('role');
    fixture.detectChanges();
    tick(1200);
    const input = getElement(hostDebug)('smart-search-input').nativeElement;

    expect(input.value).toEqual('role');
  }));

  it('should set default value to input', fakeAsync(() => {
    smartSearchServiceSpy.searchBy.and.returnValue(of([]));
    component.searchText = new FormControl('role');
    fixture.detectChanges();

    tick(1200);
    const input = getElement(hostDebug)('smart-search-input').nativeElement;

    expect(input.value).toEqual('role');
  }));
});
