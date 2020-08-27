// clustering using pm2

const express = require("express");
const crypto = require("crypto");
const app = express();

// The request handlers are executed in event loop.
app.get("/", (req, res, next) => {
  console.log("Received / request");
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    res.status(200).send("Hi there!");
  });
});

app.get("/fast", (req, res, next) => {
  res.status(200).send("This is fast!");
});

app.listen(3000);
