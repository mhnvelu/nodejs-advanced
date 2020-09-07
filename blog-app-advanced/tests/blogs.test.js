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

  describe("using invalid inputs", () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("the form shows an error message", async () => {
      const titleError = await page.getContentsOf("form .title .red-text");
      expect(titleError).toEqual("You must provide a value");

      const contentError = await page.getContentsOf("form .content .red-text");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});
