import { TestBed } from '@angular/core/testing';

import { DidBookService } from './did-book.service';
import { DidBookHttpService } from './did-book-http.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { toastrSpy } from '@tests';
import { of, throwError } from 'rxjs';

describe('DidBookService', () => {
  let service: DidBookService;
  const didBookHttpServiceSpy = jasmine.createSpyObj(DidBookHttpService, [
    'getList',
    'add',
    'delete',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DidBookService,
        { provide: DidBookHttpService, useValue: didBookHttpServiceSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy },
      ],
    });
    service = TestBed.inject(DidBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get list of elements', (done) => {
    didBookHttpServiceSpy.getList.and.returnValue(of([{}]));
    service.getList();
    service.getList$().subscribe((list) => {
      expect(list.length).toEqual(1);
      done();
    });
  });

  it('should add element to the list after adding one', (done) => {
    didBookHttpServiceSpy.add.and.returnValue(of({}));
    service.add({});
    service.getList$().subscribe((list) => {
      expect(list.length).toEqual(1);
      done();
    });
  });

  it('should call toastr error when error occurs while adding a record', (done) => {
    didBookHttpServiceSpy.add.and.returnValue(
      throwError({ message: 'adding error' })
    );
    service.add({});
    service.getList$().subscribe(() => {
      expect(toastrSpy.error).toHaveBeenCalledWith('adding error');
      done();
    });
  });

  it('should remove element from the list', (done) => {
    didBookHttpServiceSpy.getList.and.returnValue(
      of([{ id: '1' }, { id: '2' }])
    );
    didBookHttpServiceSpy.delete.and.returnValue(of({}));
    service.getList();
    service.delete('1');
    service.getList$().subscribe((list) => {
      expect(list.length).toEqual(1);
      expect(list[0].id).toEqual('2');
      done();
    });
  });

  it('should call toastr error when error occurs while removing a record', (done) => {
    didBookHttpServiceSpy.delete.and.returnValue(
      throwError({ message: 'removing error' })
    );
    service.delete('');
    service.getList$().subscribe(() => {
      expect(toastrSpy.error).toHaveBeenCalledWith('removing error');
      done();
    });
  });

  it('should return true when checking if did exist', () => {
    didBookHttpServiceSpy.getList.and.returnValue(
      of([{ did: '1' }, { did: '2' }])
    );

    service.getList();

    expect(service.exist('1')).toBeTrue();
  });

  it('should return false when checking if did exist', () => {
    didBookHttpServiceSpy.getList.and.returnValue(
      of([{ did: '1' }, { did: '2' }])
    );

    service.getList();

    expect(service.exist('3')).toBeFalse();
  });
});
