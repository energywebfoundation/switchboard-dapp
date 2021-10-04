describe('Asset functionality', () => {
  it('Should visit assets and register one', () => {
    cy.visit('/');
    cy.wait(5000);
    cy.dataQaId('loading').should('not.exist');
    cy.visitAssets();
    cy.registerAsset();
  });
});
