const { CheckUserIsInDb } = require("./user");
const fs = require("fs");
const SMTPServer = require("smtp-server").SMTPServer;

const server = new SMTPServer({
  authMethods: ["PLAIN"],
  logger: true,
  secure: true,
  secured: true,
  allowInsecureAuth: true,
  keepAlive: true,
  size: 25 * 1024 * 1024,

  disableReverseLookup: true,
  needsUpgrade: true,
  name: "shanisinojiya.tech",
  banner: "Welcome to shanisinojiya.tech",

  useXClient: true,
  useXForward: true,

  key: fs.readFileSync("./domain.key", "utf-8"),
  cert: fs.readFileSync("./domain.crt", "utf-8"),
  passphrase: "Shani@9880",

  onAuth(auth, session, callback) {
    console.log("Auth event");
    console.log("session", session.id);
    if (!CheckUserIsInDb(auth.username, auth.password)) {
      return callback(new Error("Invalid username or password"));
    }

    console.log("Auth Event End");
    callback(null, {
      user: {
        username: auth.username,
      },
    });
  },
  onConnect(session, cb) {
    console.log("Connected");
    cb(null);
  },
  onClose() {
    console.log("Connection closed");
  },

  onData(stream, session, callback) {
    console.log("Data event");
    stream.pipe(process.stdout);
    console.log("Data event end");
    stream.on("end", callback);

    stream.on("error", (err) => {
      console.log("Error %s", err.message);
    });
  },

  onMailFrom(address, session, callback) {
    console.log("Mail from:", address.address);

    callback();
  },

  onRcptTo(address, session, callback) {
    console.log("Rcpt to:", address.address);
    callback();
  },
});

server.on("error", (err) => {
  console.log("Error %s", err.message);
});

server.listen(587); // Change the port to 587 for SMTP submission
