const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class CustomPage {
  constructor(page) {
    this.page = page;
  }

  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    const superPage = new Proxy(customPage, {
      get: function (target, property) {
        return target[property] || browser[property] || page[property];
      },
    });

    return superPage;
  }

  async login() {
    const user = await userFactory();
    const session = sessionFactory(user);

    // Get the cookie names from the response headers
    await this.page.setCookie({
      name: "session",
      value: session.sessionString,
    });
    await this.page.setCookie({
      name: "session.sig",
      value: session.sessionSignature,
    });

    await this.page.goto("http://localhost:3000/blogs");
    //wait for chromium to render the page till the element with this selector available
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    const content = await this.page.$eval(selector, (el) => el.innerHTML);
    return content;
  }

  async get(path) {
    return await this.page.evaluate((_path) => {
      return fetch(_path, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    }, path);
  }

  async post(path, data) {
    return await this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_data),
        }).then((res) => res.json());
      },
      path,
      data
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
