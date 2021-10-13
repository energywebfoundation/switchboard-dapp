
describe('Dashboard view tests', () => {
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
  it('should see user info in dashboard', () => {
    cy.wait('@cachedDidDoc');
    cy.dataQaId('user-info-name').contains('Test name');
  });

  xit('should copy did to clipboard', () => {
    // TODO: find why it is not clicking
    cy.wait(5000);
    cy.get('.did-wrapper').click();
    cy.get('#toast-container .toast-message').contains('User Did successfully copied to clipboard.');
  });
});
