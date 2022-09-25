const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://demo.saleor.io/dashboard',
    viewportHeight: 1080,
    viewportWidth: 1920,
    pageLoadTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
