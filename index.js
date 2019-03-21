const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const secrets = require("./secrets");
const db = require("./db");
var bcrypt = require("bcryptjs");
const csurf = require("csurf");
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
// OR "myapp.herokuapp.com:*"

app.use(compression());
app.use(express.static("./public"));
app.use(bodyParser.json());

app.use(
    cookieSession({
        secret: secrets.cookieSecret,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(function(req, res, next) {
    console.log(req.session);
    next();
});

//BCRYPT

function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
}

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/user", function(req, res) {
    db.fetchUserById(req.session.userId)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(() => {
            console.log("fetching doesnt work");
        });
});

app.get("/difuser/:id", function(req, res) {
    let isCurrent = false;
    let id = req.params.id;
    if (id == req.session.userId) {
        isCurrent = true;
    }
    db.fetchUserById(id)
        .then(data => {
            data.rows[0].isCurrent = isCurrent;
            res.json(data.rows[0]);
        })
        .catch(() => {
            console.log("fetching doesnt work");
        });
});

app.get("/friendships/:rec", function(req, res) {
    let rec = req.params.rec;
    db.fetchFriendshipStatus(rec, req.session.userId)
        .then(data => {
            if (data.rows[0]) {
                res.json(data.rows[0]);
            } else {
                res.json(false);
            }
        })
        .catch(() => {
            console.log("fetching doesnt work");
        });
});

app.get("/friendslist", function(req, res) {
    db.fetchFriendsById(req.session.userId)
        .then(data => {
            res.json(data.rows);
        })
        .catch(() => {
            console.log("fetching doesnt work");
        });
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", function(req, res) {
    hashPassword(req.body.pass)
        .then(hashPass => {
            db.addUser(req.body.first, req.body.last, req.body.email, hashPass)
                .then(data => {
                    req.session.userId = data.rows[0].id;
                    res.json({ success: true });
                })
                .catch(err => console.log("error:", err));
        })
        .catch(err => console.log("error:", err));
});

app.post("/login", (req, res) => {
    if (req.body.email == `` || req.body.password == ``) {
        console.log("all fields must be filled");
    } else {
        db.fetchUser(req.body.email)
            .then(function(data) {
                if (data.rows[0] == undefined) {
                    console.log("email doesnt exist");
                }
                checkPassword(req.body.password, data.rows[0].password)
                    .then(function(val) {
                        if (val == true) {
                            req.session.userId = data.rows[0].id;
                            res.json({ success: true });
                        } else {
                            console.log("password doesnt match");
                        }
                    })
                    .catch(err => console.log("error1", err));
            })
            .catch(err => console.log("error2", err));
    }
});

app.post("/postBio", (req, res) => {
    db.updateBio(req.body.bio, req.session.userId)
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log("db error", err);
        });
});

app.post("/postFriendship", (req, res) => {
    if (req.body.action == "insert") {
        db.addFriendship(req.session.userId, req.body.reciever)
            .then(data => {
                res.json(data.rows);
            })
            .catch(err => {
                console.log("db error", err);
            });
    } else if (req.body.action == "update") {
        console.log("update posted", req.body.reciever);
        db.updateFriendship(req.session.userId, req.body.reciever)
            .then(data => {
                res.json(data.rows);
            })
            .catch(err => {
                console.log("db error", err);
            });
    } else if (req.body.action == "delete") {
        console.log("delete posted", req.body.reciever);
        db.deleteFriendship(req.session.userId, req.body.reciever)
            .then(data => {
                res.json(data.rows);
            })
            .catch(err => {
                console.log("db error", err);
            });
    } else {
        console.log("Request error");
    }
});

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    let picurl = secrets.s3Url + req.file.filename;
    console.log(picurl);
    db.uploadProfPic(picurl, req.session.userId)
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log("db error", err);
        });
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

// SOCKET IO

// const onlineUsers = {};
// io.on("connection", socket => {
//     console.log("socket connected, id:", socket.id);
//     const { userId } = socket.request.session;
//     if (!userId) {
//         return socket.disconnect();
//     }
//     onlineUsers[socket.id] = userId;
//     //send socket the full list of online onlineUsers
//     db.getUsersByIds(Object.values(onlineUsers))
//         .then()
//         .catch();
//
//     //part about new user joining
//     socket.emit("onlineUsers", {});
//     socket.on("disconnect", () => {
//         console.log("socket Disconnected, id:", socket.id);
//         delete onlineUsers[socket.id];
//     });
// });
