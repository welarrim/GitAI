"use strict";

// Init env variables
const host = process.env.HOST || "http://0.0.0.0";
const port = process.env.PORT || 3000;
const gitlabHost = process.env.GITLAB_HOST || "";
const xGitlabToken = process.env.X_GITLAB_TOKEN || "";

// Init modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const actuator = require("express-actuator");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const gitlab = require("./gitlab");
const logger = require("../logger");

// Check Gitlab Origin
const url = new URL(gitlabHost);
const origin = url.origin;
if (!origin) {
  logger.error(
    "Invalid Gitlab origin. Please check GITLAB_HOST env. Stopping the application."
  );
  process.exit(1);
}

// Cors options
const corsOptions = { origin };

// Access log rotation
const accessLogStream = rfs.createStream("./logs/access.log", {
  interval: "1d",
  compress: "gzip",
});

// Gitlab middleware to check X-Gitlab-Token at every request
const gitlabMiddleware = (req, res, next) => {
  const actualToken = req.get("X-Gitlab-Token");

  if (!actualToken || actualToken !== xGitlabToken) {
    logger.error("Unauthorized: X-GITLAB-TOKEN not match");
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

class Server {
  constructor() {
    logger.info("Init express...");
    this.app = express();

    this.app.use(bodyParser.json());
    this.app.use(cors(corsOptions));
    this.app.use(actuator("/management"));
    this.app.use(morgan("combined", { stream: accessLogStream }));

    this.app.post("/gitlab", gitlabMiddleware, (req, res) => {
      logger.info("Received request at /gitlab");
      const payload = req.body;

      // Send response to Gitlab that we received his request successfully
      res.status(200).send("Webhook received successfully");

      const Gitlab = new gitlab(payload);
      Gitlab.process();
    });

    this.app.post("/github", (req, res) => {
      logger.info("Received request at /github");

      // Send response to Github that we received his request successfully
      res.status(200).send("Webhook received successfully");

      // Todo: add Github services
    });
  }

  // Method to start the Express server
  startServer() {
    this.app.listen(port, () => {
      logger.info(`Server is running on ${host}:${port}`);
    });
  }
}

module.exports = Server;
