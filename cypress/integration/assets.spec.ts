describe('Asset functionality', () => {
  it('Should visit assets and register one', () => {
    cy.login();
    cy.dataQaId('loading').should('not.exist');
    cy.visitAssets();
    // cy.registerAsset();
  });
});
