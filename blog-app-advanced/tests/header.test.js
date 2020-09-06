const Page = require("./helpers/Page");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");

let page;

// Launch browser and page before each testcase
beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

// Browser termination
afterEach(async () => {
  await page.close();
});

test("Header has correct text", async () => {
  // This code is serilazed as text, executed on chromium as JS and gets the result as text
  await page.waitFor("a.brand-logo");
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("Clicking login starts OAuth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("Check Logout button exists after login", async () => {
  const user = await userFactory();
  const session = sessionFactory(user);

  // Get the cookie names from the response headers
  await page.setCookie({ name: "session", value: session.sessionString });
  await page.setCookie({
    name: "session.sig",
    value: session.sessionSignature,
  });

  await page.goto("localhost:3000");

  //wait for chromium to render the page till the element with this selector available
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

  expect(text).toEqual("Logout");
});
