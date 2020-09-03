const puppeteer = require("puppeteer");

test("Launch a browser", async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("localhost:3000");

  // This code is serilazed as text, executed on chromium as JS and gets the result as text
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  console.log(text);
  expect(text).toEqual("Blogster");
});
