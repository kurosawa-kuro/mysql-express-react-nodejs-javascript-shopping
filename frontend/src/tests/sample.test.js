const { chromium } = require('playwright');

describe('React App Test', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    it('should display the home page', async () => {
        await page.goto('http://localhost:3000');
        await page.waitForSelector('h1');

        const title = await page.$eval('h1', (element) => element.textContent);
        expect(title).toBe('Latest Products');
    });
});
