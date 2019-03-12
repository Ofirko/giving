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
    console.log("get user worked");
    db.fetchUser(req.session.userId)
        .then(data => {
            console.log("fetched user:", data);
            res.json(data.rows[0]);
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
            console.log("hashed: ", hashPass);
            db.addUser(req.body.first, req.body.last, req.body.email, hashPass)
                .then(data => {
                    console.log("axios post worked", req.body.first);
                    console.log("data:", data);
                    console.log("body", req.body.email);
                    req.session.userId = req.body.email;
                    console.log("cookie:", req.session.userId);
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
        console.log(req.body.email);
        db.fetchUser(req.body.email)
            .then(function(data) {
                if (data.rows[0] == undefined) {
                    console.log("email doesnt exist");
                }
                console.log("response:", data.rows[0]);
                checkPassword(req.body.password, data.rows[0].password)
                    .then(function(val) {
                        console.log("response2:", val);
                        if (val == true) {
                            req.session.userId = data.rows[0].email;
                            console.log("all good");
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
    console.log("upload invoked");
    console.log("req", req.body, req.session);
    let picurl = secrets.s3Url + req.file.filename;
    console.log(picurl);
    db.uploadProfPic(picurl, req.session.userId)
        .then(data => {
            console.log("data i get back from the promise", data.rows);
            res.json(data.rows);
        })
        .catch(err => {
            console.log("db error", err);
        });
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
