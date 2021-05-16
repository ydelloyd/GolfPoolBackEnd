var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
var tableName = "event";

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
      let results = data.Items;
      results.sort(function (a, b) {
        return b.eventStart.localeCompare(a.eventStart);
      });
      res.send(results);
    }
  });
});

router.get("/:id", function (req, res, next) {
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
