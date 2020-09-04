const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  // Passport stores in this structure in session.
  const sessionObject = {
    passport: {
      user: user._id.toString(),
    },
  };

  // sessionsString is equivalent of session in set-cookie response header
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    "base64"
  );

  // sessionSignature is equivalent to session.sig in set-cookie response header
  const sessionSignature = keygrip.sign("session=" + sessionString);

  return { sessionString: sessionString, sessionSignature: sessionSignature };
};
