require("dotenv").config();
// console.log(process.env.JWT_SECRET);

const { PORT = 3000 } = process.env;
const express = require("express");
const server = express();

const morgan = require("morgan");
server.use(morgan("dev"));
server.use(express.json()); // read incoming JSON requests. req headers has to be Content-Type: application/json

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

const { client } = require("./db");
client.connect();

const apiRouter = require("./api");
server.use("/api", apiRouter);

// const usersRouter = require("./api/users");
// apiRouter.use("/users", usersRouter);

// const postsRouter = require("./api/posts");
// apiRouter.use("/posts", postsRouter);

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});

module.exports = apiRouter;
