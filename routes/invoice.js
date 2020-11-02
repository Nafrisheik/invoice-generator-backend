var express = require('express');
var router = express.Router();
const { MongoClient, url, dbname, ObjectId } = require("../config");
var {authenticateMan,authenticateAdmin,authenticateEmp} = require("./common/authenticate")


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
