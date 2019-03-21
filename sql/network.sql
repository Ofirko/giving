DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS messages;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(150) NOT NULL,
    lastname VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    picurl VARCHAR(300),
    bio TEXT
);

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender INT REFERENCES users(id) NOT NULL,
    receiver INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sender INT REFERENCES users(id) NOT NULL DEFAULT 0,
    receiver INT REFERENCES users(id),
    message TEXT NOT NULL
);
