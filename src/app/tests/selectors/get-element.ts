import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export const getElement = (hostDebug: DebugElement) => {
  return (id, postSelector = '') =>
    hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));
};

export const getElementByCss = (hostDebug: DebugElement) => {
  return (selector) => hostDebug.query(By.css(`${selector}`));
};
