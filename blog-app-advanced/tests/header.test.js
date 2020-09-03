const puppeteer = require("puppeteer");

let browser, page;

// Launch browser and page before each testcase
beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto("localhost:3000");
});

// Browser termination
afterEach(async () => {
  await browser.close();
});

test("Launch a browser", async () => {
  // This code is serilazed as text, executed on chromium as JS and gets the result as text
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});
