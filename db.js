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

module.exports.fetchUserById = function fetchUserById(id) {
    return db.query("SELECT * FROM users WHERE id = $1", [id]);
};

module.exports.fetchFriendshipStatus = function fetchFriendshipStatus(
    viewed,
    current
) {
    return db.query(
        "SELECT * FROM friendships WHERE sender IN ($1, $2) AND receiver IN ($1, $2)",
        [viewed, current]
    );
};

// ***************
//PROFILE EDITING
// ***************

module.exports.uploadProfPic = function uploadProfPic(url, id) {
    return db.query(
        "UPDATE users SET picUrl = ($1) WHERE id = ($2) RETURNING *",
        [url, id]
    );
};

module.exports.updateBio = function updateBio(bio, id) {
    return db.query("UPDATE users SET bio = ($1) WHERE id = ($2) RETURNING *", [
        bio,
        id
    ]);
};

// ***************
//FRIENDSHIP EDITING
// ***************

module.exports.addFriendship = function addFriendship(sender, receiver) {
    return db.query(
        "INSERT INTO friendships (sender, receiver) VALUES($1, $2) RETURNING *",
        [sender, receiver]
    );
};

module.exports.updateFriendship = function updateFriendship(sender, receiver) {
    return db.query(
        "UPDATE friendships SET accepted = true WHERE sender = ($2) AND receiver = ($1) RETURNING *",
        [sender, receiver]
    );
};

module.exports.deleteFriendship = function deleteFriendship(sender, receiver) {
    return db.query(
        "DELETE FROM friendships WHERE sender = ($1) OR  sender = ($2) AND receiver = ($2) OR receiver = ($1)",
        [sender, receiver]
    );
};
