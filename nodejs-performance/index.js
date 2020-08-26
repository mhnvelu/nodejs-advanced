const express = require("express");
const app = express();

const doWork = (duration) => {
  const start = Date.now();
  while (Date.now() - start < duration) {}
};

// The request handlers are executed in event loop.
// So, the event loop will block for 5 seconds below and it cant handle any other request, it cant perform any other operations
app.get("/", (req, res, next) => {
  doWork(5000);
  res.status(200).send("Hi there !");
});

app.listen(3000);
