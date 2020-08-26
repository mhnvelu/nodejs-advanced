const cluster = require("cluster");

console.log(cluster.isMaster);

// Is the file being executed in master mode?
if (cluster.isMaster) {
  // This causes index.js to be executed again but in child mode
  cluster.fork();
  cluster.fork();
} else {
  // This is child mode. It acts as server
  const express = require("express");
  const crypto = require("crypto");
  const app = express();

  // The request handlers are executed in event loop.
  // So, the event loop will block for 5 seconds below and it cant handle any other request, it cant perform any other operations
  app.get("/", (req, res, next) => {
    crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
      res.status(200).send("Hi there!");
    });
  });

  app.get("/fast", (req, res, next) => {
    res.status(200).send("This is fast!");
  });

  app.listen(3000);
}
