declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command visit Assets Page
     * @example cy.dataCy('greeting')
     */
    visitAssets(): void;

    /**
     * Custom command to open dialog for registering asset
     */
    registerAsset(): void;
  }
}

Cypress.Commands.add('visitAssets', () => {
  cy.dataQaId('Assets').click();
});

Cypress.Commands.add('registerAsset', () => {
  cy.dataQaId('register-asset').click();
  cy.dataQaId('dialog-register-asset').click();
});
