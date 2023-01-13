const express = require("express");
const apiRouter = express.Router();

const usersRouter = require("./api/users");
apiRouter.use("/users", usersRouter);

const postsRouter = require("./api/posts");
apiRouter.use("/posts", postsRouter);

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;
