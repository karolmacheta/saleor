/// <reference types="cypress" />
import testUser from "../fixtures/credentials.json"
import { adminPage } from "../locators/adminPage.js"

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe("Test for changing login pass", () => {
    beforeEach(function () {
        cy.visit("/");
        cy.login(testUser.email, testUser.pass);
        cy.get(adminPage.popup).should('not.be.visible');
        cy.get(adminPage.userMenu).click({ force: true });
        cy.get(adminPage.userSettingsBtn).should('be.visible').click();
        cy.url().should('include', 'dashboard/staff/');
       cy.get(adminPage.changePassBtn).click();

    });

    it("Negative Scenario - Cant change pass in demo mode", () => {
        cy.get(adminPage.oldPassInput).clear().type('admin');
        cy.get(adminPage.newPassInput).clear().type('123456789');
        cy.get(adminPage.saveBtn).click();
        cy.get(adminPage.notification).should('be.visible').invoke("text").then(text => {
            expect(text).to.contain("Saleor runs in read-only mode. Changes not saved.");
        })
    });

    it("Negative Scenario - Cant change pass in demo mode with mocked data", () => {
        cy.get(adminPage.oldPassInput).clear().type('admin123');
        cy.get(adminPage.newPassInput).clear().type('123456789');

        cy.intercept('POST', 'https://demo.saleor.io/graphql/', {
            fixture: "../fixtures/mockNegative.json",
        }).as('mockedNegativeResponse');

        cy.get(adminPage.saveBtn).click();

        cy.get("@mockedNegativeResponse").then(res => {
            console.log(res)
            expect(res.response.statusCode).to.equal(200)
        });

        cy.get('[data-test="notification"]').should('be.visible').invoke("text").then(text => {
            cy.log(text);
            expect(text).to.contain("Old password isn't valid.See error log");
        });
    });

    it("Positive Scenario - Can change pass in demo mode with mocked data", () => {
        cy.get(adminPage.oldPassInput).clear().type('admin');
        cy.get(adminPage.newPassInput).clear().type('123456789');

        cy.intercept('POST', 'https://demo.saleor.io/graphql/', {
            fixture: "../fixtures/mockPositive.json",
        }).as('mockedPositiveResponse');

        cy.get(adminPage.saveBtn).click();

        cy.get("@mockedPositiveResponse").then(res => {
            console.log(res)
            expect(res.response.statusCode).to.equal(200)
        });

        cy.get('[data-test="notification"]').should('be.visible').invoke("text").then(text => {
            cy.log(text);
            expect(text).to.contain("Saved changes");
        });
    });
})