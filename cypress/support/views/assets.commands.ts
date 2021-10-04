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
  cy.intercept({
    method: 'GET',
    url: '**/assets/owner/*'
  }, {fixture: 'assets/owner-list.json'}).as('getOwnerAssets');
  cy.dataQaId('Assets').click();
  cy.wait('@getOwnerAssets');
});

Cypress.Commands.add('registerAsset', () => {
  cy.dataQaId('register-asset').click();
  cy.dataQaId('dialog-register-asset').click();
});
