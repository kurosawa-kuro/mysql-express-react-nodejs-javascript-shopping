const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');

test.describe('React App Test', () => {
    let browser;
    let page;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    });

    test.afterAll(async () => {
        await browser.close();
    });

    test.beforeEach(async () => {
        page = await browser.newPage();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('should display the home page', async () => {
        const expectedName = 'john8';
        const email = 'john8@example.com';
        const password = '123456';

        await page.goto('http://localhost:3000/register');
        await page.getByPlaceholder('Enter name').click();
        await page.getByPlaceholder('Enter name').fill(expectedName);
        await page.getByPlaceholder('Enter email').fill(email);
        await page.getByPlaceholder('Enter password').fill(password);
        await page.getByPlaceholder('Confirm password').fill(password);
        await page.getByRole('button', { name: 'Register' }).click();

        await page.waitForSelector('span[data-testid="user-info-name"]');
        const timestamp = new Date().getTime();
        const screenshotPath = `./src/tests/screenshot/screenshot_${timestamp}.png`;

        await page.screenshot({ path: screenshotPath });
        const nameElement = await page.$('span[data-testid="user-info-name"]');
        const actualName = await nameElement.textContent();

        expect(actualName).toBe(expectedName);
    });
});
