var express = require("express");
var cors = require('cors')
var app = express.Router();
var usersRouter = require("./allUsers");
var invoiceRouter = require("./invoice");

app.use("/allUsers", usersRouter);
app.use("/invoice", invoiceRouter);

module.exports = app;