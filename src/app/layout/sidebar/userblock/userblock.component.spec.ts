/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';

import { UserblockComponent } from './userblock.component';
import { UserblockService } from './userblock.service';

xdescribe('Component: Userblock', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserblockService]
    }).compileComponents();
  });

  it('should create an instance', (inject([UserblockService], (userBlockService) => {
    const component = new UserblockComponent(userBlockService);
    expect(component).toBeTruthy();
  })));
});
