import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultComponent } from './search-result.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IamService } from '../../shared/services/iam.service';
import { of } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { provideMockStore } from '@ngrx/store/testing';
const loadingServiceSpy = jasmine.createSpyObj(['show', 'hide']);

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultComponent],
      imports: [ReactiveFormsModule, FormsModule, MatButtonToggleModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of(),
          },
        },
        {
          provide: LoadingService,
          useValue: loadingServiceSpy,
        },
        { provide: IamService, useValue: {} },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
