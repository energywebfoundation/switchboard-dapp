import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export const shouldEmit = (button, component, dialogSpy, prop) => {
  spyOn(component[prop], 'emit');

  dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });
  button.click();

  expect(component[prop].emit).toHaveBeenCalled();
};
export const shouldNotEmit = (button, component, dialogSpy, prop) => {
  spyOn(component[prop], 'emit');

  dialogSpy.open.and.returnValue({ afterClosed: () => of(false) });
  button.click();

  expect(component[prop].emit).not.toHaveBeenCalled();
};

export const actionSelectors = (hostDebug: DebugElement) => {
  const getElement = (id, postSelector = '') =>
    hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));

  return {
    viewBtn: getElement('view-roles')?.nativeElement,
    createRoleBtn: getElement('create-role')?.nativeElement,
    editBtn: getElement('edit')?.nativeElement,
    deleteBtn: getElement('delete')?.nativeElement,
    copyEnrolmentUrl: getElement('copy-enrolment-url')?.nativeElement,
    createSubOrgBtn: getElement('create-sub-org')?.nativeElement,
    viewAppsBtn: getElement('view-apps')?.nativeElement,
    getElement,
  };
};
