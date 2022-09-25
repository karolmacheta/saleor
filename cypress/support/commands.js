Cypress.Commands.add('login', (email, password) => {
    cy.get('[data-test-id="email"]').should('be.visible').clear().type(email);
    cy.get('[data-test-id="password"]').clear().type(password);
    cy.get('[data-test-id="submit"]').click();
})