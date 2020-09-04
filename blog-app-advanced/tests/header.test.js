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
  // await browser.close();
});

test("Header has correct text", async () => {
  // This code is serilazed as text, executed on chromium as JS and gets the result as text
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("Clicking login starts OAuth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test.only("Check Logout button exists after login", async () => {
  // In this test, session is faked
  const userId = "5f47e956b5309960c80adff9";
  const Buffer = require("safe-buffer").Buffer;

  // Passport stores in this structure in session.
  const sessionObject = {
    passport: {
      user: userId,
    },
  };

  // sessionsString is equivalent of session in set-cookie response header
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    "base64"
  );

  const Keygrip = require("keygrip");
  const keys = require("../config/keys");
  const keygrip = new Keygrip([keys.cookieKey]);
  // sessionSignature is equivalent os session.sig in set-cookie response header
  const sessionSignature = keygrip.sign("session=" + sessionString);

  console.log(sessionString);
  console.log(sessionSignature);

  // Get the cookie names from the response headers
  await page.setCookie({ name: "session", value: sessionString });
  await page.setCookie({ name: "session.sig", value: sessionSignature });

  await page.goto("localhost:3000");

  //wait for chromium to render the page till the element with this selector available
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

  expect(text).toEqual("Logout");
});
