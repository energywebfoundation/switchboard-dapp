describe('Asset functionality', () => {
  before(() => {
    cy.login();
    cy.dataQaId('loading').should('not.exist');
  });
  it('Should visit assets, register one and edit it\'s values', () => {
    cy.visitAssets();

    cy.registerAsset();
    cy.wait('@getOwnerAssets', {timeout: 30000});
    cy.wait(1000);

    cy.openEditAssetDialog(0);

    cy.insertValue('name', 'Custom asset name');
    cy.insertValue('icon',
      'https://spng.subpng.com/20180421/bie/kisspng-royal-dutch-shell-logo-natural-gas-shell-oil-compa-5adb85a3723d63.5812828415243360354679.jpg');
    cy.dataQaId('next').click();
    // cy.intercept({
    //   method: 'GET',
    //   url: '**/DID/*'
    // }).as('getCachedDidDocs');
    // cy.wait('@getOwnerAssets', {timeout: 30000});
    //
    // cy.wait('@getCachedDidDocs', {timeout: 30000});
    // cy.wait(4000);
    //
    // cy.dataQaId('logo-0').should('have.attr', 'src').should('include', 'shell-oil');
    // cy.dataQaId('name-0').contains('Custom asset name');
  });
});
