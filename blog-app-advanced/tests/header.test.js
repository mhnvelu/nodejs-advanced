const puppeteer = require("puppeteer");

test("Launch a browser", async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = browser.newPage();
});
