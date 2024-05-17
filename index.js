const { CheckUserIsInDb } = require("./user");
const fs = require("fs");
const SMTPServer = require("smtp-server").SMTPServer;

const server = new SMTPServer({
  authOptional: true,
  authMethods: ["PLAIN"],
  onAuth(auth, session, callback) {
    console.log("Auth event");
    console.log("session", session);
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
    console.log("Connected", session);
    cb();
  },
  onClose(session) {
    console.log("Connection closed", session);
  },

  onData(stream, session, callback) {
    console.log("Data event");
    stream.pipe(process.stdout);
    console.log("Data event end");
    stream.on("end", callback);
  },

  onMailFrom(address, session, callback) {
    console.log("Mail from:", address.address);
    callback();
  },

  onRcptTo(address, session, callback) {
    console.log("Rcpt to:", address.address);
    callback();
  },

  logger: true,
  secure: true,
  secured: true,

  key: fs.readFileSync("./domain.key", "utf-8"),
  cert: fs.readFileSync("./domain.crt", "utf-8"),
  passphrase: "Shani@9880",
});

server.on("error", (err) => {
  console.log("Error %s", err.message);
});

server.listen(465, "mail.shanisinojiya.tech");
