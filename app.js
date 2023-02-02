"use strict";
var expect = require("chai").expect;
var socketChat = require("./src/classes/main").server,
  server = new socketChat("localhost", 3000), // Set Host And Port Here
  bcrypt = require("bcrypt-nodejs"),
  axios = require("axios"),
  apiUrl = "http://localhost:3000",
  online = [],
  unseenPromises = [];

// Application Routes
server.app.use("/assets", server.express.static(`public/assets`));
server.app.use("/reg_assets", server.express.static(`public/reg/`));
server.app.use("/components", server.express.static(`public/components`));
server.app.use(server.express.json());
server.app.use(server.express.urlencoded());

let checkAuth = (req, res, next) => {
  // Here you can define custom rules / security checks (Middleware checks)
  next();
};

server.app.get("/", (req, res) => {
  return res.redirect("/login");
});
server.app.get("/chat-room", checkAuth, (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});
server.app.get("/login", (req, res) => {
  res.sendFile(`${__dirname}/public/reg/index.html`);
});
server.app.get("/register", (req, res) => {
  res.sendFile(`${__dirname}/public/reg/register.html`);
});

// API routes (here you can define your own rules for routes)
server.app.post("/register", (req, res) => {
  let hash = "";
  if (req.body.password != "") {
    hash = bcrypt.hashSync(req.body.password);
    req.body.password = hash;
  }
  server
    .addUser(req.body)
    .then((data) => {
      res
        .status(201)
        .json({ id: data._id, message: "User added successfully." });
    })
    .catch((errors) => {
      if (errors.errmsg != undefined) {
        if (errors.errmsg.search("E11000") > -1) {
          // The Field is unique
          res
            .status(422)
            .json({ error: "Username or Email is already taken." });
        }
      }
      res.status(422).json(errors);
    });
});

server.app.post("/login", (req, res) => {
  server
    .fetchUserByUsername(req.body.username)
    .then((user) => {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.status(200).json({ token: user._id });
      } else {
        res.status(422).json({ message: "Username / Password Incorrect." });
      }
    })
    .catch((err) => {});
});

server.app.get("/check-auth/:token", (req, res) => {
  server
    .fetchUserByToken(req.params.token)
    .then((user) => {
      if (user._id != undefined) {
        res.status(200).json({ message: "Authentic", user: user });
      } else {
        res.status(401).json({ message: "Unauthorised" });
      }
    })
    .catch((err) => {
      res.status(401).json({ message: "Unauthorised" });
    });
});

// API call to get all conversation between two users
server.app.post("/messages", checkAuth, (req, res) => {
  server.fetchUserByUsername(req.body.to).then((to) => {
    server.fetchMessages(req.body.from, to._id).then((messages) => {
      res.status(200).json(messages);
    });
  });
});

// API call to get unseen count of particular conversation
server.app.post("/messages/unseen_count", checkAuth, (req, res) => {
  server.fetchUnseenMessages(req.body.from, req.body.to).then((unseen) => {
    res.status(200).json({ unseen: unseen.length, from: req.body.from });
  });
});

// API call to mark messages seen
server.app.post("/messages/mark_seen/:token", checkAuth, (req, res) => {
  server.fetchUserByUsername(req.body.from).then((from) => {
    server.markSeen(from._id, req.params.token);
    res.status(201).json({ message: "Seen" });
  });
});

// API call to store a new message
server.app.post("/messages/:to", checkAuth, (req, res) => {
  server.fetchUserByUsername(req.params.to).then((to) => {
    req.body.to = to._id.toString();
    server
      .storeMessage(req.body)
      .then((data) => {
        res.status(201).json({ message: "Message sent successfully" });
      })
      .catch((err) => {
        res.status(401).json({ message: "Unauthorised" });
      });
  });
});

// Socket IO Calls
server.io.on("connection", (socket) => {
  socket.on("make-online", (user) => {
    server
      .fetchUserByToken(user.token)
      .then((data) => {
        if (data) {
          online.push({
            token: user.token,
            sockID: socket.id,
            user: data.username,
          });
          socket.broadcast.emit("make-online", { user: data.username });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  socket.on("get-users", (data) => {
    server
      .fetchUserByToken(data.token)
      .then((user) => {
        if (user._id != undefined) {
          server
            .fetchUsers()
            .then((users) => {
              for (let i = 0; i < users.length; i++) {
                if (checkOnline(users[i]._id) != false) {
                  users[i]["status"] = "online";
                } else {
                  users[i]["status"] = "offline";
                }
              }
              return users;
            })
            .then((users) => {
              for (let i = 0; i < users.length; i++) {
                const options = {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  data: { from: users[i]._id, to: data.token },
                  url: `${apiUrl}/messages/unseen_count`,
                };
                unseenPromises.push(axios(options));
              }
              Promise.all(unseenPromises).then((result) => {
                result.forEach((status) => {
                  users.forEach((user) => {
                    if (user._id == status.data.from) {
                      let index = users.indexOf(user);
                      users[index]["unseen"] = status.data.unseen;
                    }
                  });
                });
                socket.emit("get-users", users);
              });
            });
        }
      })
      .catch((err) => {});
  });
  socket.on("get-messages", (data) => {
    let chat = {};
    chat.from = data.token;
    chat.to = data.to;
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      data: chat,
      url: `${apiUrl}/messages`,
    };
    axios(options)
      .then((data) => {
        socket.emit("get-messages", data.data);
      })
      .catch();
  });

  socket.on("send-message", (data) => {
    // Check online status, if online then broadcast and save in db
    let onlineUser = checkOnlineByUsername(data.to);
    if (onlineUser) {
      let index = online.indexOf(onlineUser);
      let sockID = online[index].sockID;
      socket.to(sockID).emit("send-message", data);
    }
    delete data["created"];
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      data: data,
      url: `${apiUrl}/messages/${data.to}`,
    };
    axios(options).then((response) => {
      // console.log(response.data);
    });
  });
  socket.on("typing", (data) => {
    let user = checkOnlineByUsername(data.user);
    if (user) {
      let index = online.indexOf(user);
      let sockID = online[index].sockID;
      socket.to(sockID).emit("typing", { status: true, from: data.from });
    }
  });
  socket.on("stop-typing", (data) => {
    let user = checkOnlineByUsername(data.user);
    if (user) {
      let index = online.indexOf(user);
      let sockID = online[index].sockID;
      socket.to(sockID).emit("stop-typing", { status: false, from: data.user });
    }
  });

  socket.on("mark-seen", (data) => {
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      data: { from: data.from },
      url: `${apiUrl}/messages/mark_seen/${data.to}`,
    };
    axios(options).then((dta) => {
      if (dta.data.message == "Seen") {
        socket.emit("mark-seen", { from: data.from });
      }
    });
  });

  socket.on("disconnect", () => {
    let user = checkOnlineSockID(socket.id);
    if (user) {
      makeOffline(socket.id);
      socket.broadcast.emit("make-offline", { user: user.user });
    }
  });
});

function checkOnline(id) {
  let user = online.find((user) => {
    return user.token == id;
  });
  if (user) {
    return user;
  } else {
    return false;
  }
}

function checkOnlineByUsername(username) {
  let user = online.find((user) => {
    return user.user == username;
  });
  if (user) {
    return user;
  } else {
    return false;
  }
}

function checkOnlineSockID(sockID) {
  let user = online.find((user) => {
    return user.sockID == sockID;
  });
  if (user) {
    return user;
  } else {
    return false;
  }
}

function makeOffline(sockID) {
  let usr = online.find((user) => {
    return user.sockID == sockID;
  });
  let index = online.indexOf(usr);
  online.splice(index, 1);
}
