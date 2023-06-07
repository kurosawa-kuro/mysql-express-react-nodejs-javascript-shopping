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
        await page.goto('http://localhost:3000/login');
        await page.waitForSelector('h1');
        await page.click('text="Sign In"');
        await page.fill('input[type="email"]', 'john@example.com');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');
        await page.waitForSelector('h1');
        const title = await page.$eval('h1', (element) => element.textContent);

        expect(title).toBe('Latest Products');
    });
});
