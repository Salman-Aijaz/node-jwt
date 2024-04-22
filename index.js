const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "secret_key";
app.use(express.json());

app.get("/", (req, resp) => {
  resp.json({
    message: "My First Api Test In Node.JS",
  });
});

const users = [];
app.post("/login", (req, resp) => {
  const { username, email } = req.body;
  const user = users.find(
    (user) => user.username === username && user.email === email
  );

  if (!user) {
    return resp.status(400).json({ message: "User is not found" });
  } else {
    jwt.sign({ user }, secretKey, { expiresIn: "1200s" }, (err, token) => {
      resp.json({
          // token,
        result: `Hello  ${user.username} Welcome to our website`,
      });
    });
  }
});

app.post("/signup", (req, resp) => {
  const { username, email } = req.body;

  const userExist = users.find(
    (user) => user.username === username || user.email === email
  );

  if (userExist) {
    return resp
      .status(400)
      .json({ message: "Username or email is already exist" });
  }

  const newUser = {
    id: users.length + 1,
    username,
    email,
  };
  users.push(newUser);
  jwt.sign(
    { user: newUser },
    secretKey,
    { expiresIn: "1200s" },
    (err, token) => {
      resp.json({
        token,
      });
    }
  );
});

function verifyToken(req, resp,next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== undefined) {
    // const header = bearerHeader.split(" ")
    // const token = header.pop()
    req.token = bearerHeader;
    next();
  } else {
    resp.send({
      result: "Token is not valid",
    });
  }
}

app.post("/profile", verifyToken, (req, resp) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      resp.send({ result: "invalid token" });
    } else {
      resp.json({
        message: "profile succeed",
        authData,
      });
    }
  });
});

app.listen(5000, () => {
  console.log("App is working fine ");
});
