import { Endpoints } from '../support/endpoints/endpoints';

describe('Dashboard view tests', () => {
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
  it('should see user info in dashboard', () => {
    cy.wait('@cachedDidDoc');
    cy.dataQaId('user-info-name').contains('Test name');
  });

  it('should copy did to clipboard', () => {
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq('your copied text');
      });
    });
  });
});
