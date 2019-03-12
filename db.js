var spicedPg = require("spiced-pg");
const secrets = require("./secrets");
let path =
    "postgres:" +
    secrets.user +
    ":" +
    secrets.pass +
    "@localhost:5432/socialnetwork";
var db = spicedPg(process.env.DATABASE_URL || path);

module.exports.addUser = function addUser(first, last, email, pass) {
    return db.query(
        "INSERT INTO users (firstname, lastname, email, password) VALUES($1, $2, $3, $4) RETURNING *",
        [first, last, email, pass]
    );
};

module.exports.fetchUser = function fetchUser(email) {
    return db.query("SELECT * FROM users WHERE email = $1", [email]);
};

module.exports.uploadProfPic = function uploadProfPic(url, email) {
    return db.query(
        "UPDATE users SET picUrl = ($1) WHERE email = ($2) RETURNING *",
        [url, email]
    );
};
