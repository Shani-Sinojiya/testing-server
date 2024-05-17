const { CheckUserIsInDb } = require("./user");

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

  key: fs.readFileSync("domain.key"),
  cert: fs.readFileSync("domain.crt"),
});

server.listen(465);
