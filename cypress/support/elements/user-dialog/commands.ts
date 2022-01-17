// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    getDialogUserName(): Chainable<Element>;

    getDialogBirthdate(): Chainable<Element>;

    getDialogAddress(): Chainable<Element>;

    getDialogSubmitButton(): Chainable<Element>;
  }
}

Cypress.Commands.add('getDialogUserName', () => {
  return cy.dataQaId('dialog-input-name');
});
Cypress.Commands.add('getDialogBirthdate', () => {
  return cy.dataQaId('dialog-input-birthdate');
});
Cypress.Commands.add('getDialogAddress', () => {
  return cy.dataQaId('dialog-input-address');
});

Cypress.Commands.add('getDialogSubmitButton', () => {
  return cy.dataQaId('submit');
});
