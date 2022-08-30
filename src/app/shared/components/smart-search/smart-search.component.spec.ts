import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { SmartSearchComponent } from './smart-search.component';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchInputEvent, getElement } from '@tests';
import { SmartSearchService } from './services/smart-search.service';
import { of } from 'rxjs';
import { SmartSearchType } from './models/smart-search-type.enum';

describe('SmartSearchComponent', () => {
  let component: SmartSearchComponent;
  let fixture: ComponentFixture<SmartSearchComponent>;
  const smartSearchServiceSpy = jasmine.createSpyObj(SmartSearchService, [
    'searchBy',
  ]);
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
        NoopAnimationsModule,
      ],
      providers: [
        { provide: SmartSearchService, useValue: smartSearchServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
    const { smartSearchInput } = selectors(hostDebug);

    expect(smartSearchInput.value).toEqual('role');
    flush();
  }));

  it('should set default value to input', fakeAsync(() => {
    smartSearchServiceSpy.searchBy.and.returnValue(of([]));
    component.searchText = new FormControl('role');
    fixture.detectChanges();

    tick(1200);
    const { smartSearchInput } = selectors(hostDebug);

    expect(smartSearchInput.value).toEqual('role');
    flush();
  }));

  it('should emit event when adding role', fakeAsync(() => {
    smartSearchServiceSpy.searchBy.and.returnValue(
      of([{ namespace: 'namespace1' }, { namespace: 'namespace2' }])
    );
    component.searchType = SmartSearchType.Add;
    component.searchText = new FormControl('');
    const addSpyEvent = spyOn(component.add, 'emit');
    fixture.detectChanges();

    const { smartSearchInput } = selectors(hostDebug);

    smartSearchInput.value = 'name';
    dispatchInputEvent(smartSearchInput);
    tick(1200);
    fixture.detectChanges();

    const { add } = selectors(hostDebug);
    expect(add).toBeTruthy();
    add.click();

    expect(addSpyEvent).toHaveBeenCalledWith({
      value: 'name',
      searchType: SmartSearchType.Add,
    });
    flush();
  }));
  it('should emit an add event when an autocomplete option is selected', fakeAsync(() => {
    smartSearchServiceSpy.searchBy.and.returnValue(
      of([{ namespace: 'namespace1' }, { namespace: 'namespace2' }])
    );
    component.searchType = SmartSearchType.Add;
    component.searchText = new FormControl('name');
    const addSpyEvent = spyOn(component.add, 'emit');
    const optionSelectedEvent: MatAutocompleteSelectedEvent = {
      option: {
        value: 'name',
      },
    } as MatAutocompleteSelectedEvent;
    component.autocompleteSelectionHandler(optionSelectedEvent);
    fixture.detectChanges();
    expect(addSpyEvent).toHaveBeenCalledWith({
      value: 'name',
      searchType: SmartSearchType.Add,
    });
    flush();
  }));

  it('should emit event when clicking enter', () => {
    smartSearchServiceSpy.searchBy.and.returnValue(
      of([{ namespace: 'namespace1' }, { namespace: 'namespace2' }])
    );
    const selectedSpyEvent = spyOn(component.selected, 'emit');
    fixture.detectChanges();

    const { smartSearchInput } = selectors(hostDebug);

    smartSearchInput.value = 'name';
    smartSearchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const event = new KeyboardEvent('keyup', {
      key: 'Enter',
    });
    smartSearchInput.dispatchEvent(event);
    fixture.detectChanges();
    expect(selectedSpyEvent).toHaveBeenCalledWith({
      namespace: undefined,
      keyword: 'name',
    });
  });
  it('click search', () => {
    const searchTextUpdateSpy = spyOn(
      component.searchText,
      'updateValueAndValidity'
    );
    fixture.detectChanges();

    const { smartSearchInput } = selectors(hostDebug);

    smartSearchInput.value = 'name';
    dispatchInputEvent(smartSearchInput);
    fixture.detectChanges();

    const { search } = selectors(hostDebug);

    search.click();

    expect(searchTextUpdateSpy).toHaveBeenCalled();
  });
});

const selectors = (hostDebug) => {
  return {
    smartSearchInput:
      getElement(hostDebug)('smart-search-input')?.nativeElement,
    clear: getElement(hostDebug)('clear')?.nativeElement,
    add: getElement(hostDebug)('add')?.nativeElement,
    search: getElement(hostDebug)('search')?.nativeElement,
  };
};
