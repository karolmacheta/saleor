/// <reference types="cypress" />
import testUser from "../fixtures/credentials.json"

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe("Test for changing login pass", () => {
    beforeEach(function () {
        cy.visit("https://demo.saleor.io/dashboard");
        cy.login(testUser.email, testUser.pass);
        cy.get('[data-test-type="info"]').should('not.be.visible');
        cy.get('[data-test="userMenu"]').click({ force: true });
        cy.get('[data-test-id="account-settings-button"]').should('be.visible').click();
        cy.url().should('include', 'https://demo.saleor.io/dashboard/staff/');
        cy.get('.MuiCardHeader-action > .MuiButtonBase-root > .MuiButton-label').click();
    });

    it("Negative Scenario - Cant change pass in demo mode", () => {
        cy.get('.MuiDialogContent-root > :nth-child(1) > .MuiInputBase-root > .MuiInputBase-input').clear().type('admin');
        cy.get(':nth-child(3) > .MuiInputBase-root > .MuiInputBase-input').clear().type('123456789');
        cy.get('.MuiDialogActions-root > .MuiButton-contained').click();
        cy.get('[data-test="notification"]').should('be.visible').invoke("text").then(text => {
            cy.log(text);
            expect(text).to.contain("Saleor runs in read-only mode. Changes not saved.");
        })
    });

    it("Negative Scenario - Cant change pass in demo mode with mocked data", () => {
        cy.get('.MuiDialogContent-root > :nth-child(1) > .MuiInputBase-root > .MuiInputBase-input').clear().type('admin');
        cy.get(':nth-child(3) > .MuiInputBase-root > .MuiInputBase-input').clear().type('123456789');
        cy.intercept('POST', 'https://demo.saleor.io/graphql/', {
            fixture: "../fixtures/mockNegative.json",
        }).as('mockedNegativeResponse');
        cy.get('.MuiDialogActions-root > .MuiButton-contained').click();

        cy.get("@mockedNegativeResponse").then(res => {
            console.log(res)
            expect(res.response.statusCode).to.equal(200)
        });

        cy.get('[data-test="notification"]').should('be.visible').invoke("text").then(text => {
            cy.log(text);
            expect(text).to.contain("Something went wrongOld password isn't valid.See error log");
        });
    });

    it("Positive Scenario - Cant change pass in demo mode with mocked data", () => {
        cy.get('.MuiDialogContent-root > :nth-child(1) > .MuiInputBase-root > .MuiInputBase-input').clear().type('admin');
        cy.get(':nth-child(3) > .MuiInputBase-root > .MuiInputBase-input').clear().type('123456789');
        cy.intercept('POST', 'https://demo.saleor.io/graphql/', {
            fixture: "../fixtures/mockPositive.json",
        }).as('mockedPositiveResponse');
        cy.get('.MuiDialogActions-root > .MuiButton-contained').click();

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