const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

// promisify converts a function which accepts callback into a function which returns promise.
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

// Toggleable Cache
mongoose.Query.prototype.cache = function () {
  this.useCache = true;
  return this;
};

mongoose.Query.prototype.exec = async function () {
  console.log("Mongoose Query exec hook for redis");

  if (!this.useCache) {
    return await exec.apply(this, arguments);
  }

  const redisKey = JSON.stringify({
    ...this.getQuery(),
    collection: this.mongooseCollection.name,
  });
  console.log(redisKey);

  // Do we have any cached data in redis for this redisKey?
  const cachedValue = await client.get(redisKey);
  // If Yes, then respond to the request and return
  if (cachedValue) {
    console.log("Serving from cache");
    // we need return mongoose doc from exec function. But we got json form redis cache

    const doc = JSON.parse(cachedValue);

    const result = Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);

    return result;
  }
  // If No, then respond to the request and update the cache to store the data

  const result = await exec.apply(this, arguments);

  //set cache with expiration of 10s
  client.set(redisKey, JSON.stringify(result), "EX", 10);
  return result;
};