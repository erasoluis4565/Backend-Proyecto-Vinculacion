const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const errorHandler =
require("./middlewares/error.middleware");

const apiLimiter =
require("./middlewares/rate-limit.middleware");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(apiLimiter);

app.use("/api", require("./routes"));

app.use(errorHandler);

module.exports = app;