const Page = require("./helpers/page");

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

describe("When logged in", () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("can see blog create form", async () => {
    const url = await page.url();
    expect(url).toMatch(/blogs\/new/);

    const title = await page.getContentsOf("form .title label");
    expect(title).toEqual("Blog Title");

    const content = await page.getContentsOf("form .content label");
    expect(content).toEqual("Content");
  });
});
