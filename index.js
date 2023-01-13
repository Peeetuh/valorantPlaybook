const PORT = 3000;
const express = require("express");
const server = express();

const apiRouter = express.Router();

const morgan = require("morgan");
server.use(morgan("dev"));

server.use(express.json()); // read incoming JSON requests. req headers has to be Content-Type: application/json

// const apiRouter = require("./api");
server.use("/api", apiRouter);

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

const { client } = require("./db");
client.connect();

const usersRouter = require("./api/users");
apiRouter.use("/users", usersRouter);

const postsRouter = require("./api/posts");
apiRouter.use("/posts", postsRouter);

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});

module.exports = apiRouter;
