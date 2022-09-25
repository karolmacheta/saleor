import { adminPage } from "../locators/adminPage.js"

Cypress.Commands.add('login', (email, password) => {
    cy.get(adminPage.loginForm.email).should('be.visible').clear().type(email);
    cy.get(adminPage.loginForm.pass).clear().type(password);
    cy.get(adminPage.loginForm.submitBtn).click();
})