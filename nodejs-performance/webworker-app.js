// Using webworker threads
const express = require("express");
const crypto = require("crypto");
const Worker = require("webworker-threads").Worker;
const app = express();

// The request handlers are executed in event loop.
app.get("/", (req, res, next) => {
  const worker = new Worker(function () {
    this.onmessage = function () {
      let counter = 0;
      while (counter < 1e9) {
        counter++;
      }
    };

    postMessage(counter);
  });

  worker.onmessage = function (message) {
    res.send("" + message.data);
  };

  worker.postMessage();
});

app.get("/fast", (req, res, next) => {
  res.status(200).send("This is fast!");
});

app.listen(3000);
