// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-qa-id attribute.
     * @example cy.dataCy('greeting')
     */
    dataQaId(value: string): Chainable<Element>;

    /**
     * Navigates to main page and waits for login response.
     */
    login(): void;

    insertValue(id: string, value: string): Chainable<Element>;
  }
}

Cypress.Commands.add('dataQaId', (id: string) => {
  return cy.get(`[data-qa-id=${id}]`);
});

Cypress.Commands.add('login', () => {
  cy.visit('/');
  cy.intercept('**/login').as('getLogin');
  cy.wait('@getLogin', {timeout: 30000});
});

Cypress.Commands.add('insertValue', (id: string, value: string) => {
  return cy.dataQaId(id).type(value, {force: true});
});