const { Given, When, Then } = require('@wdio/cucumber-framework');
const {updateTestExecution} = require('../../config/testlink/testlink-init')

const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');

const pages = {
    login: LoginPage
}

Given(/^I am on the (\w+) page$/, async (page) => {
    await pages[page].open()
});

When(/^I login with (\w+) and (.+)$/, async (username, password) => {
    await LoginPage.login(username, password)
});

Then(/^I should see a flash message saying (.*)$/, async (message) => {
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(message);
    const now = new Date();
    const fileName = '/Users/lamle/workplace/webdriver-io/reports/capture/' + now.toString() + '.png';
    await browser.saveScreenshot(fileName);
    await updateTestExecution('001-1', 'Test01_001', 'Test', 'test', fileName, 'noted', true);
});

