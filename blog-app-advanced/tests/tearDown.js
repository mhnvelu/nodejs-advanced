const mongoose = require("mongoose");

module.exports = async () => {
  mongoose.Promise = global.Promise;
  mongoose.connection
    .close()
    .then((result) => {
      console.log("Disconnected DB from Jest Setup");
    })
    .catch((err) => console.log(err));
};
