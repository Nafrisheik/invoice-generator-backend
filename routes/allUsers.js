var express = require("express");
var router = express.Router();
const { MongoClient, url, dbname, ObjectId, appUrl } = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nafrisheikh@gmail.com",
    pass: "9841473476",
  },
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", async function (req, res, next) {
  let client;
  try {
    client = await MongoClient.connect(url);
    let db = client.db(dbname);
    //generate salt
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(req.body.password, salt);

    //assigning hash value as a replacement for password in db.
    req.body.password = hash;

    let mailExist = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (!mailExist) {
      await db.collection("users").insertOne(req.body);
      const userData = await db.collection("users").findOne(req.body);
      client.close();
      const options = {
        from: "irf_hus@yahoo.in",
        to: req.body.email,
        subject: "Activate your account to start using and then login",
        html:
          `<p>Click <a href="${appUrl}api/allUsers/activate/"` +
          userData._id +
          '">here</a> to activate your account</p>',
      };

      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Sent" + info.response);
      });

      res.json({
        message: "User Registered",
      });
    } else {
      res.json({
        message: "User already exists",
      });
    }
  } catch (error) {
    if (client) client.close();
    console.log(error);
  }
});

//api to login for existing user
router.get("/activate/:id", async function (req, res) {
  let client;
  try {
    client = await MongoClient.connect(url);
    let db = client.db(dbname);

    await db
      .collection("users")
      .findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $set: { activated: true } }
      );

    client.close();
    res.json({
      message: "Activated",
    });
  } catch (error) {
    if (client) client.close();
    console.log(error);
  }
});
//change password for forgot password
router.post("/change/:email", async function (req, res) {
  let client;
  try {
    client = await MongoClient.connect(url);
    let db = client.db(dbname);

    let token = jwt.sign({ email: req.params.email }, "change");
    let user = await db
      .collection("users")
      .findOneAndUpdate(
        { email: req.params.email },
        { $set: { password: token } }
      );
    const options = {
      from: "irf_hus@yahoo.in",
      to: req.body.email,
      subject: "Forgot password link",
      html:
        `<p>Click <a href=${appUrl}api/allUsers/verify/' ` +
        token +
        '">here</a> to change your password</p>',
    };

    transporter.sendMail(options, function (err, info) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Sent" + info.response);
    });

    client.close();
    res.json({
      message: "New password sent",
    });
  } catch (error) {
    if (client) client.close();
    console.log(error);
  }
});
//api to route to new password page
router.get("/verify", async function (req, res) {
  res.send("User verified");
});

router.post("/activate/:password", async function (req, res) {
  let client;
  try {
    client = await MongoClient.connect(url);
    let db = client.db(dbname);

    await db
      .collection("users")
      .findOneAndUpdate(
        { password: req.headers.token },
        { $set: { password: req.params.password } }
      );

    client.close();
    res.json({
      message: "New password set",
    });
  } catch (error) {
    if (client) client.close();
    console.log(error);
  }
});

router.get("/activate/:id", async function (req, res) {
  let client;
  try {
    client = await MongoClient.connect(url);
    let db = client.db(dbname);

    await db
      .collection("users")
      .findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $set: { activated: true } }
      );

    client.close();
    res.json({
      message: "Activated",
    });
  } catch (error) {
    if (client) client.close();
    console.log(error);
  }
});

//api to login for existing user
router.post("/login", async function (req, res) {
  let client;
  try {
    client = await MongoClient.connect(url);
    let db = client.db(dbname);

    let user = await db.collection("users").findOne({ email: req.body.email });
    if (user) {
      if (user.activated) {
        let result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          // if(user.type="Manager"){
          let token = jwt.sign({ id: user._id }, user.type);
          client.close();
          res.json({
            message: "success",
            token,
            type: user.type,
          });
          // } else if (user.type="Admin") {
          //   let token = jwt.sign({ id: user._id }, "qrssthyz");
          // client.close();
          // res.json({
          //   message: "success",
          //   token,
          //   type: user.type,
          // });
          // } else if(user.type="Employee") {
          //   let token = jwt.sign({ id: user._id }, "polsmnmnm");
          // client.close();
          // res.json({
          //   message: "success",
          //   token,
          //   type: user.type,
          // });
          // }
        } else {
          client.close();
          res.status(401).json({
            message: "Username and Password is wrong",
          });
        }
      } else {
        client.close();
        res.status(401).json({
          message: "You need to activate your account first",
        });
      }
    } else {
      res.status(404).json({
        message: "Username does not match",
      });
    }
    client.close();
    res.json({
      message: "login success",
    });
  } catch (error) {
    if (client) client.close();
    console.log(error);
  }
});

module.exports = router;
