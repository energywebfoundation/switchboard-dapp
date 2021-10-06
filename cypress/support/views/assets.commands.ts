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

    /**
     *  Opens dialog for editition and sets values.
     */
    openEditAssetDialog(id: number): void;
  }
}

Cypress.Commands.add('visitAssets', () => {
  cy.intercept({
    method: 'GET',
    url: '**/assets/owner/*'
  }).as('getOwnerAssets');
  cy.dataQaId('Assets').click();
  cy.wait('@getOwnerAssets');
});

Cypress.Commands.add('registerAsset', () => {
  cy.dataQaId('register-asset').click();
  cy.dataQaId('dialog-register-asset').click();
  cy.intercept({method: 'GET', url: '**/assets/*'}).as('registeredAsset');
  cy.wait('@registeredAsset', {timeout: 30000});
});

Cypress.Commands.add('openEditAssetDialog', (id: number) => {
  cy.dataQaId('menu-' + id).click({waitForAnimations: true, force: true});
  cy.dataQaId('edit').click({force: true});
  cy.wait(500);
});
