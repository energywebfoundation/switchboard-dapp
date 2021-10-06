import { Endpoints } from '../support/endpoints/endpoints';
import { UserDialogEnum } from '../support/elements/user-dialog/user-dialog.enum';

describe('Header view tests', () => {
  before(() => {
    cy.login();
    cy.intercept({method: 'GET', url: Endpoints.assetsOfferedTo}, {body: {}}).as('offeredTo');
    cy.intercept({method: 'GET', url: Endpoints.getIssuerClaim}, {body: {}}).as('issuerClaim');
    cy.intercept({
      method: 'GET',
      url: Endpoints.getRequesterClaim
    }, {fixture: 'claims/requester-claims-basic.json'}).as('requesterClaim');
    cy.intercept({method: 'GET', url: Endpoints.getCachedDidDoc}, {fixture: 'did/cached-did.json'}).as('cachedDidDoc');
  });

  it('should open dialog and check if data is displayed', () => {
    cy.dataQaId('user-menu').click({force: true});
    cy.dataQaId('opened-menu-name').contains(UserDialogEnum.userName);
    cy.dataQaId('menu-update-identity').click();

    cy.getDialogUserName().should('have.value', UserDialogEnum.userName);
    cy.getDialogBirthdate().should('have.value', '6/7/1981');
    cy.getDialogAddress().should('have.value', 'Address');

  });

  it('should check user name validation', () => {
    cy.getDialogUserName().clear().blur();
    cy.validationError('Name is required');

  });

});
