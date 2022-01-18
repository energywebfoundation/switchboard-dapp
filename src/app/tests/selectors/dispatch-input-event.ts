export const dispatchInputEvent = (el) => {
  el.dispatchEvent(new Event('input'));
  el.dispatchEvent(new Event('blur'));
};
