import { adminPage } from "../locators/adminPage.js"

Cypress.Commands.add('login', (email, password) => {
    cy.get(adminPage.loginForm.email).should('be.visible').clear().type(email);
    cy.get(adminPage.loginForm.pass).clear().type(password);
    cy.get(adminPage.loginForm.submitBtn).click();
})

Cypress.Commands.add('checkNotificationText', (notificationText) => {

cy.get(adminPage.notification).should('be.visible').invoke("text").then(text => {
    cy.log(text);
    expect(text).to.contain(notificationText);
    });
})

Cypress.Commands.add('expectResponseStatus', (apiCall, code) => {
    cy.get(apiCall).then(res => {
        console.log(res)
        expect(res.response.statusCode).to.equal(code)
    });
});

