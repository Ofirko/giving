const express = require("express");
const app = express();
const compression = require("compression");
// const db = require("./db");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
// const csurf = require("csurf");
// var bcrypt = require("bcryptjs");
const secrets = require("./secrets");
const db = require("./db");
var bcrypt = require("bcryptjs");

app.use(compression());
app.use(express.static("./public"));
app.use(bodyParser.json());

app.use(
    cookieSession({
        secret: secrets.cookieSecret,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2
    })
);

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

app.listen(8080, function() {
    console.log("I'm listening.");
});
