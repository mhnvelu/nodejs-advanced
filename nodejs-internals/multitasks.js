const https = require("https");
const crypto = require("crypto");
const fs = require("fs");
const start = Date.now();

function doRequest() {
  https
    .request("https://www.google.com", (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        console.log("https req : ", Date.now() - start);
      });
    })
    .end();
}

function doHash() {
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    console.log("Hash : ", Date.now() - start);
  });
}

// OS handles it. so finishes first
doRequest();

// fs module uses libuv thread pool
// This involves 2 pauses
// 1. Get stats from filesystem
// 2. Get content from file
// At step 1, the thread waits for stats from filesystem, so it pauses this task and picks pending hashing function from below
// So, the file read takes more time than expected.
// If there are no tasks waiting to be picked by thread pool, then the thread will pick the
// read file again and finishes quickly as expected.
fs.readFile("multitasks.js", "utf8", () => {
  console.log("FS : ", Date.now() - start);
});

// cryto module also uses libuv threadpool
doHash();
doHash();
doHash();
doHash();
