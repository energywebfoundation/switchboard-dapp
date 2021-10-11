
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

  it('should copy did to clipboard', () => {
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq('your copied text');
      });
    });
  });
});
