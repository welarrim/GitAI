"use strict";

require("dotenv").config();

const server = require("./services/server");

const Server = new server();

Server.startServer();
