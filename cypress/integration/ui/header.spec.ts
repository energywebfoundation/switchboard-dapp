import { userDialog } from '../../support/elements/user-dialog/user.dialog';

describe('Header view tests', () => {
  before(() => {
    cy.login();
    cy.intercept({method: 'GET', url: '**/assets/offered_to/*'}, {body: {}}).as('offeredTo');
    cy.intercept({method: 'GET', url: '**/claim/issuer/*'}, {body: {}}).as('issuerClaim');
    cy.intercept({
      method: 'GET',
      url: '**/claim/requester/*'
    }, {fixture: 'claims/requester-claims-basic.json'}).as('requesterClaim');
    cy.intercept({method: 'GET', url: '**/DID/*'}, {fixture: 'did/cached-did.json'}).as('cachedDidDoc');
  });

  it('should open dialog and check if data is displayed', () => {
    cy.wait('@cachedDidDoc');
    cy.waitUntilLoaderDisappear();
    cy.dataQaId('user-menu').click({force: true});
    cy.dataQaId('opened-menu-name').contains(userDialog.name);
    cy.dataQaId('menu-update-identity').click();

    cy.getDialogUserName().should('have.value', userDialog.name);
    cy.getDialogBirthdate().should('have.value', '6/7/1981');
    cy.getDialogAddress().should('have.value', 'Address');

  });

  it('should check user name validation', () => {
    cy.getDialogUserName().click().clear().blur();
    cy.validationError('Name is required');
    cy.getDialogSubmitButton().should('be.disabled');

    cy.getDialogUserName().type('Te');
    cy.getDialogSubmitButton().should('be.enabled');

    // clean up
    cy.getDialogUserName().click().clear().type(userDialog.name);
  });

  it('should check date of birth validation', () => {
    cy.getDialogBirthdate().click().clear().blur();
    cy.validationError('Date of birth is required');
    cy.getDialogSubmitButton().should('be.disabled');

    cy.getDialogBirthdate().type('1/1/2018');
    cy.validationError('Maximum allowed date is');
    cy.getDialogSubmitButton().should('be.disabled');
    cy.getDialogBirthdate().click().clear().blur();

    cy.getDialogBirthdate().type('1/1/2001');
    cy.getDialogSubmitButton().should('be.enabled');

    cy.getDialogBirthdate().click().clear().type(userDialog.dateOfBirth);
  });

  it('should check address validation', () => {
    cy.getDialogAddress().click().clear().blur();
    cy.validationError('Address is required');
    cy.getDialogSubmitButton().should('be.disabled');

    cy.getDialogAddress().type('example address');
    cy.getDialogSubmitButton().should('be.enabled');
  });

});
