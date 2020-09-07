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

  describe("using valid inputs", () => {
    beforeEach(async () => {
      await page.type(".title input", "My Title");
      await page.type(".content input", "My Content");
      await page.click("form button");
    });

    test("submitting the form takes the user to review screen", async () => {
      const reviewPageTitle = await page.getContentsOf("h5");
      expect(reviewPageTitle).toEqual("Please confirm your entries");
    });

    test("submitting and saving adds blog to index page", async () => {
      await page.click("button.green");
      // Save sends the request to server. so we need to waitFor new page to arrive before proceeding with the test
      await page.waitFor(".card");

      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf(".card-content p");
      expect(title).toEqual("My Title");
      expect(content).toEqual("My Content");
    });
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

describe("When user is not logged in", () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs",
    },
    {
      method: "post",
      path: "/api/blogs",
      data: {
        title: "MY Other title",
        content: "My Other content",
      },
    },
  ];

  test("Blog related actions are prohibited", async () => {
    const results = await page.execRequests(actions);
    results.forEach((result) => {
      expect(result).toEqual({ error: "You must log in!" });
    });
  });
});
