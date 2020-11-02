const mongodb = require("mongodb");
require("dotenv").config();
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const url = process.env.dbUrl;
const dbname = process.env.dbname;
const appUrl = process.env.nodeUrl;
const port = process.env.port;
module.exports = { MongoClient, url, dbname, ObjectId, appUrl,port };
