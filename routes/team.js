var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
var tableName = "team";
const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: "dyingduckoboeplayer@gmail.com",
    //ADD PASSWORD HERE
    pass: "",
  },
  secure: true,
});

router.get("/all", function (req, res, next) {
  var params = {
    TableName: tableName,
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      res.status(err.statusCode).send(err);
    } else {
      console.log("Success", data.Items);
      res.send(data.Items);
    }
  });
});

router.get("/eventId/:id", function (req, res, next) {
  var params = {
    TableName: tableName,
    Key: { id: req.params.id },
  };

  docClient.get(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      res.status(err.statusCode).send(err);
    } else {
      console.log("Success", data.Item);
      res.send(data.Item);
    }
  });
});

router.post("/", function (req, res, next) {
  const mailData = {
    from: "dyingduckoboeplayer@gmail.com", // sender address
    to: "ydelloyd@gmail.com", // list of receivers
    subject: "New team was created",
    text: `A team ${req.body.name} was created by ${
      req.body.owner
    } with player 1 as ${req.body.player1}, player 2 as ${
      req.body.player2
    }, player 3 as ${req.body.player3}, player 3 as ${
      req.body.player3
    }, player 4 as ${req.body.player4}, player 5 as ${
      req.body.player5
    } at ${new Date()}.
          Data Dump: ${JSON.stringify(req.body)}`,
  };
  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
  var params = {
    TableName: tableName,
    Item: req.body,
  };

  // Call DynamoDB to add the item to the table
  docClient.put(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      res.status(err.statusCode).send(err);
    } else {
      console.log("Success", data);
      res.send(data);
    }
  });
});

module.exports = router;
