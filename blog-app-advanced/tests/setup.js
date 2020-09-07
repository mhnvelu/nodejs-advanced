// Timeout for individual test case
jest.setTimeout(30000);

require("../models/User");
const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose.Promise = global.Promise;
mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Connected to DB from Jest Setup");
  })
  .catch((err) => console.log(err));
