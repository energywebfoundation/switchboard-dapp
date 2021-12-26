import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmartSearchComponent } from './smart-search.component';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DomainsFacadeService } from '../../services/domains-facade/domains-facade.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getElement } from '@tests';

describe('SmartSearchComponent', () => {
  let component: SmartSearchComponent;
  let fixture: ComponentFixture<SmartSearchComponent>;
  const domainsFacadeSpy = jasmine.createSpyObj(DomainsFacadeService, ['getENSTypesBySearchPhrase']);
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
      providers: [{provide: DomainsFacadeService, useValue: domainsFacadeSpy}],
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

  xit('should update displayed value', () => {
    const control = new FormControl('role');
    component.searchText = control;
    fixture.detectChanges();

    control.patchValue('role');
    fixture.detectChanges();

    const input = getElement(hostDebug)('smart-search-input').nativeElement;

    expect(input.value).toEqual('role');
  });
});
